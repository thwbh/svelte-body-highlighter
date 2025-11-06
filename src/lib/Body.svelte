<script lang="ts">
  import type { ExtendedBodyPart, BodyProps } from '$lib/types';

  import MaleFrontSVG from '$lib/assets/svg/male-front.svg?raw';
  import MaleBackSVG from '$lib/assets/svg/male-back.svg?raw';
  import FemaleFrontSVG from '$lib/assets/svg/female-front.svg?raw';
  import FemaleBackSVG from '$lib/assets/svg/female-back.svg?raw';

  let {
    colors = ['#0984e3', '#74b9ff'],
    data,
    scale = 1,
    side = 'front',
    gender = 'male',
    onBodyPartPress = undefined,
    border = '#dfdfdf'
  }: BodyProps = $props();

  let svgContainer = $state<HTMLDivElement | undefined>(undefined);

  // Calculate SVG content based on gender and side
  let svgContent = $derived(
    gender === 'male'
      ? (side === 'front' ? MaleFrontSVG : MaleBackSVG)
      : (side === 'front' ? FemaleFrontSVG : FemaleBackSVG)
  );

  // Calculate dimensions based on scale (matching old wrapper behavior)
  let height = $derived(400 * scale);
  let width = $derived(200 * scale);

  // Update SVG classes when data or svgContent changes
  $effect(() => {
    // Track both data and svgContent
    data;
    svgContent;

    if (svgContainer) {
      // Use a small delay to ensure the new SVG is rendered in the DOM
      setTimeout(() => {
        updateSVGClasses(data);
      }, 0);
    }
  });

  function updateSVGClasses(bodyPartData: ExtendedBodyPart[]) {
    if (!svgContainer) return;

    // Find all body part paths in SVG
    const bodyPartPaths = svgContainer.querySelectorAll('.body-part');

    // Reset all paths to default state
    bodyPartPaths.forEach((path) => {
      (path as SVGPathElement).classList.remove('selected', 'intensity-1', 'intensity-2');
      // Remove inline color, let CSS handle it
      (path as SVGPathElement).style.removeProperty('fill');
    });

    // Apply selections based on data
    bodyPartData.forEach((part) => {
      // Find the group for this body part
      const group = svgContainer.querySelector(`[data-slug="${part.slug}"]`);
      if (!group) return;

      let paths: NodeListOf<SVGPathElement>;

      // Select the appropriate paths based on side
      if (part.side) {
        paths = group.querySelectorAll(`[data-side="${part.side}"]`);
      } else {
        // Select all paths in the group if no side specified
        paths = group.querySelectorAll('.body-part');
      }

      // Apply color and classes
      paths.forEach((path) => {
        path.classList.add('selected');

        // Apply intensity class or custom color
        if (part.color) {
          // For custom colors, use inline style as fallback
          path.style.fill = part.color;
        } else if (part.intensity) {
          path.classList.add(`intensity-${part.intensity}`);
        }
      });
    });
  }

  function handleClick(event: MouseEvent) {
    const target = event.target as SVGElement;

    // Check if clicked element or its parent group has data-slug
    let element = target;
    let slug: string | null = null;
    let partSide: 'left' | 'right' | undefined = undefined;

    // Traverse up to find data-slug and data-side
    while (element && element !== svgContainer) {
      if (!slug) {
        slug = element.getAttribute('data-slug');
      }
      if (!partSide && target.hasAttribute('data-side')) {
        const sideAttr = target.getAttribute('data-side');
        if (sideAttr === 'left' || sideAttr === 'right') {
          partSide = sideAttr;
        }
      }
      if (slug) break;
      element = element.parentElement as SVGElement;
    }

    if (slug && onBodyPartPress) {
      onBodyPartPress({ slug } as ExtendedBodyPart, partSide);
    }
  }
</script>

<div
  bind:this={svgContainer}
  onclick={handleClick}
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e as unknown as MouseEvent);
    }
  }}
  style="--svg-width: {width}px; --svg-height: {height}px; --border-color: {border};"
  class="body-svg-container"
>
  {@html svgContent}
</div>

<style>
  .body-svg-container {
    display: inline-block;
    line-height: 0;
    width: var(--svg-width);
    height: var(--svg-height);
  }

  .body-svg-container :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .body-svg-container :global(#outline path) {
    stroke: var(--body-outline-color, var(--border-color, #dfdfdf));
    stroke-width: var(--body-outline-width, 2);
  }

  .body-svg-container :global(.body-part) {
    fill: var(--body-part-default-color, #3f3f3f);
    cursor: var(--body-part-cursor, pointer);
    transition: var(--body-part-transition, fill 0.3s ease);
  }

  .body-svg-container :global(.body-part:hover) {
    opacity: var(--body-part-hover-opacity, 0.8);
  }

  .body-svg-container :global(.body-part.selected) {
    fill: var(--body-part-selected-color, var(--body-part-intensity-1-color, #0984e3));
  }

  .body-svg-container :global(.body-part.selected.intensity-1) {
    fill: var(--body-part-intensity-1-color, #74b9ff);
  }

  .body-svg-container :global(.body-part.selected.intensity-2) {
    fill: var(--body-part-intensity-2-color, #0984e3);
  }

  /* Support for head color override */
  .body-svg-container :global(#head .body-part) {
    fill: var(--body-part-head-color, var(--body-part-default-color, #bebebe));
  }

  /* When head is selected, use selection colors */
  .body-svg-container :global(#head .body-part.selected) {
    fill: var(--body-part-selected-color, var(--body-part-intensity-1-color, #0984e3));
  }

  .body-svg-container :global(#head .body-part.selected.intensity-1) {
    fill: var(--body-part-intensity-1-color, #74b9ff);
  }

  .body-svg-container :global(#head .body-part.selected.intensity-2) {
    fill: var(--body-part-intensity-2-color, #0984e3);
  }
</style>
