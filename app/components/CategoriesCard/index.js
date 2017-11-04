import React from 'react';
import Arrow from '../Arrow';

// NEED TO CONVERT TO A STATEFUL COMPONENT SO IT RERENDERS ON CLICKS
function CategoriesCard(props) {
  let placeName = (<div></div>);
  if (props.categories && props.categoryData) {
    let categorySelector = props.categories[props.category];
    placeName = (<div>{props.categoryData.places[categorySelector].name}</div>);

    const cardContent = (
      <div>
        <Arrow
          title="Right Arrow"
          onClick={(e) => rightArrowClick(e)}
        />
        {categorySelector > 0 ?
          <Arrow
            title="Right Arrow"
            onClick={(e) => leftArrowClick(e)}
          /> : ''
      }
      </div>
    );
    // if categorySelector = 0 then no left arrow, if it equals to .places length, then no left arrow
    // content = props.categoryData.places.map((value) => (
    //   <ToggleOption key={value} value={value} message={props.messages[value]} />
    // ));


    const rightArrowClick = () => {
      categorySelector += 1;
      console.log(categorySelector);
      console.log('arrow Click');
    };

    const leftArrowClick = () => {
      categorySelector += 1;
      console.log(categorySelector);
      console.log('arrow Click');
    };
// ARRROW  make a stateless component
// ARROW will be used at least 4 times.
// can pass different onclick events to the arrow
// each of those onClick events will communicate with w/e it needs to talk to


// each card needs to be expandable
// each card will have a way to change to next card
    return (
      <div>
        <h1>{placeName}</h1>
        <h2>
          {cardContent}
        </h2>
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
