import React from 'react';

function CategoriesCard(props) {
  let content = (<div></div>);
  // console.log(`CATEGORIES CARD: ${props.categoryData}`);
  // console.log(`CATEGORIES: ${props.categories}`);
  if (props.categories && props.categoryData) {
    content = (<div>GotData</div>);

    // content = props.categoryData.places.map((value) => (
    //   <ToggleOption key={value} value={value} message={props.messages[value]} />
    // ));
  }

  return (
    <div>
      {content}
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
  // values: React.PropTypes.array,
  // value: React.PropTypes.string,
  // messages: React.PropTypes.object,
};

export default CategoriesCard;
