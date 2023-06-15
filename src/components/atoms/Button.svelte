<script>
	let buttonProps = {
		class: [$$restProps.class],
	};
</script>

<button
	on:click
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:focus
	{...buttonProps}
>
	<slot />
</button>

<style>
	.app-button {
		border: none;
		font-size: 3rem;
		margin: 10px 50px;
	}
	.disabled {
		color: silver;
	}
	.danger {
		color: red;
	}
	.sm {
		font-size: 20px;
		padding: 0.1em;
	}
	.lg {
		font-size: 40px;
	}
</style>
