import { addDoc, collection, doc, getDocs, query, runTransaction, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Firestoreにアクセスし、resultをpostします。
 * @param {string} name
 * @param {number} result
 * @param {number} subResult
 * @return {string} id postしたresultのid
 */
export const addResult = async (name, result, subResult) => {
  const docRef = await addDoc(collection(db, "event_results"), {
    name: name,
    result: result,
    sub_result: subResult,
    created_at: serverTimestamp(),
  });
  console.log("Document written with ID: ", docRef.id);
  return docRef.id
};

/**
 * Firestoreにアクセスし、result一覧を取得します。
 * ※ result降順とsubResult昇順でソートします。
 * @return {sortedResults: {id: string;}[]} result一覧
 */
export const getResults = async () => {
  // Firestoreから結果一覧を取得する
  const querySnapshot = await getDocs(collection(db, "event_results"));
  const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // 取得した成績一覧情報を順位でソートする
  const sortedResults = results.sort((a, b) => {
    if (a.result === b.result) {
      return a.sub_result - b.sub_result; // resultが同じ場合はsub_resultで昇順ソート
    }
    return b.result - a.result; // resultで降順ソート
  });
  return sortedResults
}

export const getCards = async () => {
  const querySnapshot = await getDocs(collection(db, "cards"));
  return querySnapshot
}

/**
 * ターゲットとなるresultのdocument_Idを受け取り、順位を返します。
 * ※ 内部でgetResults()を使用しています。
 * @param {string} targetId ターゲットとなるresultのdocument_Id
 * @return {number} ランク (○位)
 */
export const getRank = async (targetId) => {
  const sortedResults = await getResults();
  // 特定のIDの順位を取得する
  const targetResult = sortedResults.find(score => score.id === targetId);
  const rank = sortedResults.indexOf(targetResult) + 1;
  return [rank, sortedResults.length];
}

/**
 * ターゲットとなるresultのfeeling(感想)をアップデートします。
 * @param {string} targetId ターゲットとなるresultのdocument_Id
 * @param {string} feeling 感想
 */
export const setFeeling = async (targetId, feeling) => {
  const userRef = doc(collection(db, 'event_results'), targetId);
  await updateDoc(userRef, { feeling });
}

/**
 * 条件に当てはまるdocumentを全て削除する(イベント直前に不要なresultを削除するためのメソッド)
 * 実装例) let isSuccess = await deleteDocuments("event_results", "result", "==", 0);
 * @param {string} collectionName ターゲットとなるcollection(テーブル)名
 * @param {string} fieldName 条件1: field(カラム)名
 * @param {string} operator 条件2: 比較演算子
 * @param {number} value 条件3: 値
 * @return {boolean} 実行結果
 */
export const deleteDocuments = async (collectionName, fieldName, operator, value) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(fieldName, operator, value));
    const querySnapshot = await getDocs(q);
    await runTransaction(db, async (transaction) => {
      querySnapshot.forEach((doc) => {
        transaction.delete(doc.ref);
      });
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
