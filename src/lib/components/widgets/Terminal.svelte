<script lang="ts">
	let textarea: HTMLTextAreaElement;

	function autoGrow() {
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}
</script>

<main
	class="flex h-full w-full flex-col items-start justify-start gap-5 overflow-hidden rounded-[10px] border border-white/10 bg-white/5 p-2 text-left text-[13px]"
>
	<li class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 self-stretch">
		<p class="flex-shrink-0 flex-grow-0 text-[#48ff05]">→</p>
		<p class="flex-shrink-0 flex-grow-0 text-[#afcfff]">ozenui</p>
		<textarea
			bind:this={textarea}
			rows="1"
			class="w-full resize-none border-0 bg-transparent outline-none hover:ring-0 hover:outline-none focus:ring-0 focus:outline-none"
			on:input={autoGrow}
			autofocus
		></textarea>
	</li>
</main>
