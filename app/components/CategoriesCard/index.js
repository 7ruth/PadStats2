import React from 'react';
import Arrow from '../Arrow';

class CategoriesCard extends React.Component { // eslint-disable-line

// each card should have its own state... that change on arrow clicks..
  constructor(props) {
    super(props);
    this.state = {
      categoryCounter: 0,
    };
  }

  plusOneCategoriesCounter = () => {
    this.state.categoryCounter += 1;
// console.log('State is about to be updated');
    this.setState({
      categoryCounter: this.state.categoryCounter,
    });
  }

  minusOneCategoriesCounter = () => {
    if (this.state.categoryCounter !== 0) {
      this.state.categoryCounter -= 1;
    }
// console.log('State is about to be updated');
    this.setState({
      categoryCounter: this.state.categoryCounter,
    });
  }


    // if categorySelector = 0 then no left arrow, if it equals to .places length, then no left arrow
    // content = props.categoryData.places.map((value) => (
    //   <ToggleOption key={value} value={value} message={props.messages[value]} />
    // ))
    // };
// ARRROW  make a stateless component
// ARROW will be used at least 4 times.
// can pass different onclick events to the arrow
// each of those onClick events will communicate with w/e it needs to talk to


// each card needs to be expandable
// each card will have a way to change to next card
  render() {
// console.log('top of the render')
    const { categories, categoryData } = this.props;
    let placeName = (<div></div>);
    let cardContent;
    let imageSrc;

    if (categories && categoryData) {
      const categorySelector = this.state.categoryCounter;
      placeName = (<div>{categoryData.places[categorySelector].name}</div>);
// console.log(categorySelector)
// console.log(categoryData.places)
// console.log(categoryData.places[categorySelector])
// console.log(categoryData.places[categorySelector].photos['0']);
      imageSrc = categoryData.places[categorySelector].photos['0'].getUrl({ maxWidth: 800, maxHeight: 800 });
// console.log(imageSrc);
      cardContent = (
        <div>
          <Arrow
            title="Left Arrow"
            onClick={this.plusOneCategoriesCounter}
          />
          { this.state.categoryCounter > 0 ?
            <Arrow
              title="Right Arrow"
              onClick={this.minusOneCategoriesCounter}
            /> : ''
          }
        </div>
      );
    }
// console.log('render before return');
    return (
      <div>
        <h1>{placeName}</h1>
        <img src={imageSrc} alt="" />
        <h2> {this.state.categoryCounter} </h2>
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
  // category: React.PropTypes.string,
  // values: React.PropTypes.array,
  // value: React.PropTypes.string,
  // messages: React.PropTypes.object,
};

export default CategoriesCard;
