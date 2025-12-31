<script lang="ts">
  import { onMount } from 'svelte';

  export let onScan: (decodedText: string) => void;
  export let onClose: () => void;

  function readBarcode() {
    // @ts-ignore
    my.scan({
      type: 'qr',
      success: (res: { code: any; result: any; }) => {
        const decodedText = res.code || res.result;
        onScan(decodedText);
      },
      fail: (err: any) => {
        console.error('Scan failed', err);
        onClose();
      },
    });
  }

  onMount(() => {
    // Automatically trigger scan when component mounts
    readBarcode();
  });
</script>