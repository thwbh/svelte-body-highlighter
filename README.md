# svelte-body-highlighter

This project is a Svelte/SvelteKit port of [react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter) originally created by [ELABBASSI Hicham].

> SVG human body parts highlighter for Svelte (SvelteKit compatible).

## Installation

npm

```bash
$ npm install svelte-body-highlighter
```

yarn

```bash
$ yarn add svelte-body-highlighter
```

pnpm

```bash
$ pnpm add svelte-body-highlighter
```

## Usage

### Basic example

```svelte
<script lang="ts">
  import Body from "svelte-body-highlighter";
</script>

<div class="container">
  <Body
    data={[
      { slug: "chest", intensity: 1, side: "left" },
      { slug: "biceps", intensity: 2 },
    ]}
    gender="female"
    side="front"
    scale={1.7}
    border="#dfdfdf"
  />
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>
```

<details>
<summary style="font-size:18px; font-weight: bold;">Complete example</summary>
<p>

```svelte
<script lang="ts">
  import Body from "svelte-body-highlighter";
  import type { ExtendedBodyPart } from "svelte-body-highlighter/types";

  let selectedBodyParts: ExtendedBodyPart[] = [
    { slug: "chest", intensity: 1, side: "left" },
    { slug: "biceps", intensity: 1 },
    { slug: "biceps", intensity: 2, side: "right" }
  ];

  let side: "front" | "back" = "front";
  let gender: "male" | "female" = "male";

  function handleBodyPartPress(bodyPart: ExtendedBodyPart, partSide?: "left" | "right") {
    // Toggle selection or update intensity
    const existingIndex = selectedBodyParts.findIndex(
      bp => bp.slug === bodyPart.slug && bp.side === partSide
    );

    if (existingIndex >= 0) {
      // Remove if already selected
      selectedBodyParts = selectedBodyParts.filter((_, i) => i !== existingIndex);
    } else {
      // Add with intensity 2
      selectedBodyParts = [...selectedBodyParts, {
        slug: bodyPart.slug,
        intensity: 2,
        side: partSide
      }];
    }
  }

  function toggleSide() {
    side = side === "front" ? "back" : "front";
  }

  function toggleGender() {
    gender = gender === "male" ? "female" : "male";
  }
</script>

<div class="container">
  <Body
    data={selectedBodyParts}
    {gender}
    {side}
    scale={1.7}
    border="#dfdfdf"
    onBodyPartPress={handleBodyPartPress}
  />

  <div class="controls">
    <div class="control">
      <span>Side ({side})</span>
      <label>
        <input type="checkbox" checked={side === "front"} on:change={toggleSide} />
      </label>
    </div>
    <div class="control">
      <span>Gender ({gender})</span>
      <label>
        <input type="checkbox" checked={gender === "male"} on:change={toggleGender} />
      </label>
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #fff;
  }

  .controls {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
  }

  .control {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
</style>
```

</p>
</details>

## Props

| Prop            | Required | Purpose                                                                                                       |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| data            | Yes      | `BodyPartObject[]` - Array of `BodyPartObject` to highlight                                                   |
| onBodyPartPress | No       | `Func` - `(bodyPart: BodyPartObject, side?: left \| right) => {}` Callback called when a user tap a body part |
| colors          | No       | `string[]` - Defaults to `['#0984e3', '#74b9ff']`                                                             |
| side            | No       | `front \| back` - Defaults to `front`                                                                         |
| gender          | No       | `string` - Can be "male" or "female", Defaults to `male`                                                      |
| scale           | No       | `number` - Defaults to `1`                                                                                    |
| border          | No       | `string` - Defaults to `#dfdfdf` (`none` to hide the border)                                                  |

## BodyPart object model

### Accessibility

Each `<Body />` component and its SVG wrappers (`SvgMaleWrapper`, `SvgFemaleWrapper`) are now accessible to screen readers.

- Default accessibility labels are automatically provided for gender and side (e.g., `"male-body-front"`, `"female-body-back"`).
- This improves overall screen reader compatibility by making the visual body component identifiable.
- Adding accessibility per individual body part would require a deeper refactor of how SVG paths are structured.

- #### BodyPartObject: `{ slug: BodyPartName, color: colorHexValue, intensity: IntensityNumber, side?: 'left' | 'right' }`

- #### BodyPartName: Body part name to highlight (See the list of available body parts below)

- #### colorHexValue: The Color of specific body part. Accepts HEX string. E.g `#ff0000ff`

- #### IntensityNumber: Color intensity (if the `colors` property is set: from 1 to `colors.length` + 1. If not, intensity can be 1 or 2)

- #### Side (optional): Can be `left`, `right`. Useful for selecting a single part or a pair (Do not set the side if you need to select the pair)

## List of body parts

| BodyParts    | Side                         |
| ------------ | ---------------------------- |
| trapezius    | Both                         |
| triceps      | Both                         |
| forearm      | Both                         |
| adductors    | Both                         |
| calves       | Both                         |
| hair         | Both                         |
| neck         | Both                         |
| deltoids     | Both                         |
| hands        | Both                         |
| feet         | Both                         |
| head         | Both (Front only for female) |
| ankles       | Both (Front only for female) |
| tibialis     | Front                        |
| obliques     | Front                        |
| chest        | Front                        |
| biceps       | Front                        |
| abs          | Front                        |
| quadriceps   | Front                        |
| knees        | Front                        |
| upper-back   | Back                         |
| lower-back   | Back                         |
| hamstring    | Back                         |
| gluteal      | Back                         |
