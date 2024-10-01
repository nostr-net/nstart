<div class="flex sm:flex-row flex-col max-h-max">
  <!-- Intro block -->
  <div class="flex sm:min-h-screen sm:w-[48%] flex-none items-center justify-end bg-gradient-to-tr from-neutral-200 via-neutral-100 to-white p-8 sm:p-0">
    <slot name="intro" />
  </div>

  <!-- Interactive block -->
  <div class="flex sm:w-[52%] flex-none items-center justify-start bg-white p-8 sm:p-0 mb-10">
    <slot name="interactive" />
  </div>
</div>
