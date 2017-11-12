import React from 'react';
import Arrow from '../Arrow';
import CategoryDiv from './CategoryDiv'
import ImagePOI from './ImagePOI'

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
    const { category, categories, categoryData } = this.props;
    let placeName;
    let cardContent;
    let imageSrc;
    let imageDimensions;

    if (categories && categoryData) {
      const categorySelector = this.state.categoryCounter;
      placeName = categoryData.places[categorySelector].name;
// console.log(categorySelector)
// console.log(categoryData.places)
console.log(categoryData.places[categorySelector])
console.log(categoryData.places[categorySelector].name)
// console.log(categoryData.places[categorySelector].photos['0'])
console.log('window.innerWidth');
console.log(window.innerWidth);
      imageDimensions = window.innerWidth > 1024 ? Math.floor(window.innerWidth * (0.3)) : Math.floor(window.innerWidth  * (0.4));
console.log(imageDimensions)
      imageSrc = categoryData.places[categorySelector].photos['0'].getUrl({ maxWidth: imageDimensions, maxHeight: imageDimensions });
// console.log(imageSrc);
    }
// console.log('render before return');
    return (
      <CategoryDiv id={category + 'Category'}>
          <h1>{placeName}</h1>
          <div 
            id={category + 'Category' + 'Image'}
            style={{
              width: '100%'
            }}
          >
            <ImagePOI 
              src={imageSrc} 
              alt=''
              height={imageDimensions}
            />
           
          </div>
          <Arrow
              title='Left Arrow'
              onClick={this.state.categoryCounter > 0 ? this.minusOneCategoriesCounter : ""}
              left='0px'
            /> 
          <Arrow
              title='Right Arrow'
              onClick={this.plusOneCategoriesCounter}
              right='0px'
          />
      </CategoryDiv>
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
