import React from 'react';

function CategoriesCard(props) {
  let placeName = (<div></div>);
  if (props.categories && props.categoryData) {
    const categorySelector = props.categories[props.category];
    placeName = (<div>{props.categoryData.places[categorySelector].name}</div>);

    // if categorySelector = 0 then no left arrow, if it equals to .places length, then no left arrow
    // content = props.categoryData.places.map((value) => (
    //   <ToggleOption key={value} value={value} message={props.messages[value]} />
    // ));
  }

// each card needs to be expandable
// each card will have a way to change to next card
  return (
    <div>
      <h1>{placeName}</h1>
    </div>
  );
  // If we have items, render them
  // if (props.values) {
  //   content = props.values.map((value) => (
  //     <ToggleOption key={value} value={value} message={props.messages[value]} />
  //   ));
  // }
  //
  // return (
  //   <Select value={props.value} onChange={props.onToggle}>
  //     {content}
  //   </Select>
  // );
}

CategoriesCard.propTypes = {
  categoryData: React.PropTypes.object,
  categories: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  category: React.PropTypes.string,
  // values: React.PropTypes.array,
  // value: React.PropTypes.string,
  // messages: React.PropTypes.object,
};

export default CategoriesCard;
