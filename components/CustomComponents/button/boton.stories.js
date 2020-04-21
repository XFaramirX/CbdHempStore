import React from 'react';
import Button from '@material-ui/core/Button';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

export default {
  title: 'ButtonMaterial',
  component: Button,
  viewport: { defaultViewport: 'web' },
  decorators: [withA11y, withKnobs],
};
export const botonconMaterial = () => (
  <Button variant="contained" color="primary">
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
botonconMaterial.story = {
  parameters: {
    notes: 'A small component con material yeah',
  },
};

export const withAButton = () => (
  <button disabled={boolean('Disabled', false)}>
    {text('Label', 'Hello Storybook')}
  </button>
);

export const dataTable = () => (
  <div class="comparison-table__container ts_comparisontable">
    <h2
      class="comparison-table__title title--headline2"
      id="comparison-table-1"
    >
      Title
    </h2>
    <div
      class="comparison-table"
      role="table"
      aria-label="Comparison Table"
      aria-describedby="comparison-table-1"
    >
      <div class="comparison-table__row-header-container" role="rowgroup">
        <div class="comparison-table__row" role="row">
          <div class="comparison-table__row-header comparison-table__column"></div>
        </div>
        <div class="comparison-table__row" role="row">
          <div
            class="comparison-table__row-header comparison-table__column"
            role="columnheader"
          >
            <p class="comparison-table__heading">Row 1</p>
          </div>
        </div>
        <div class="comparison-table__row" role="row">
          <div
            class="comparison-table__row-header comparison-table__column"
            role="columnheader"
          >
            <p class="comparison-table__heading">Row 2</p>
          </div>
        </div>
        <div class="comparison-table__row" role="row">
          <div
            class="comparison-table__row-header comparison-table__column"
            role="columnheader"
          >
            <p class="comparison-table__heading">Row 3</p>
          </div>
        </div>
      </div>
      <div class="comparison-table__body" role="rowgroup">
        <div class="comparison-table__row" role="row">
          <div
            class="comparison-table__column comparison-table__column-header"
            role="columnheader"
          >
            <p class="comparison-table__heading">Column 1</p>
          </div>
          <div
            class="comparison-table__column comparison-table__column-header"
            role="columnheader"
          >
            <p class="comparison-table__heading">Column 2</p>
          </div>
          <div
            class="comparison-table__column comparison-table__column-header"
            role="columnheader"
          >
            <p class="comparison-table__heading">Column 3</p>
          </div>
        </div>
        <div class="comparison-table__row" role="row">
          <div class="comparison-table__column" role="cell">
            <p>Single Item</p>
          </div>
          <div class="comparison-table__column" role="cell">
            <p>Single Item</p>
          </div>
          <div class="comparison-table__column" role="cell">
            <p>Single Item</p>
          </div>
        </div>
        <div class="comparison-table__row" role="row">
          <div class="comparison-table__column" role="cell">
            <p class="comparison-table__heading">Row 2, Title</p>
            <p>Row 2, item 1</p>
          </div>
          <div class="comparison-table__column" role="cell">
            <p class="comparison-table__heading">Row 2, Title</p>
            <p>Row 2, item 2</p>
          </div>
          <div class="comparison-table__column" role="cell">
            <p class="comparison-table__heading">Row 2, Title</p>
            <p>Row 2, item 3</p>
          </div>
        </div>
        <div class="comparison-table__row" role="row">
          <div class="comparison-table__column" role="cell">
            <ul>
              <li>$0 Annual Fee</li>
              <li>
                $33 Overdraft Fee per item we pay or return (daily maximum $165)
              </li>
              <li>Additional fees of up to $30</li>
            </ul>
          </div>
          <div class="comparison-table__column" role="cell">
            <p>$2,500.00</p>
          </div>
          <div class="comparison-table__column" role="cell">
            <p>0.05</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const asDynamicVariables = () => {
  const name = text('Name', 'James');
  const age = number('Age', 35);
  const content = `I am ${name} and I'm ${age} years old.`;

  return <div>{content}</div>;
};
