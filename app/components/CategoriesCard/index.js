import React from 'react';
import Arrow from '../Arrow';
import CategoryDiv from './CategoryDiv'
import ImagePOI from './ImagePOI'
import SmoothCollapse from '../../utils/ReactSmoothCollapse';
import CategoryToggleDiv from './CategoryToggleDiv';
import CategoryInformation from './CategoryInformation';

class CategoriesCard extends React.Component { // eslint-disable-line

// each card should have its own state... that change on arrow clicks..
  constructor(props) {
    super(props);
    this.state = {
      categoryCounter: 0,
      categoryExpanded: false
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

    this.setState({
      categoryCounter: this.state.categoryCounter,
    });
  }

  toggleCategory() {
    this.setState({ categoryExpanded: !this.state.categoryExpanded });
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
    let placeRating;
    let placeAddress;
    let cardContent;
    let imageSrc;
    let imageDimensions;

    if (categories && categoryData) {
      const categorySelector = this.state.categoryCounter;
      placeName = categoryData.places[categorySelector].name;
      placeRating = categoryData.places[categorySelector].rating;
      placeAddress = categoryData.places[categorySelector].vicinity;
      imageDimensions = window.innerWidth > 1024 ? Math.floor(window.innerWidth * (0.3)) : Math.floor(window.innerWidth  * (0.4));
      imageSrc = categoryData.places[categorySelector].photos['0'].getUrl({ maxWidth: imageDimensions, maxHeight: imageDimensions });
console.log(categoryData.places[categorySelector])
console.log(window.innerWidth > 1024)
    }

    return (
      <CategoryDiv id={category + 'Category'}>
          <div 
            id={category + 'Category' + 'Content'}
            style={{
              width: window.innerWidth > 1024 ? '70%' : '100%',
              margin: '0 auto'
            }}
          >
            <ImagePOI 
              src={imageSrc} 
              alt=''
              windowWidth={window.innerWidth}
            />
            <CategoryInformation >
              <span
                style={{
                  fontSize: '2em',
                  fontWeight: '900',
                  lineHeight: 1,
                  marginBottom: '10px'
                }}
              >
              {placeName}</span>
              <span>Rating: {placeRating}</span>
              <span>Address: {placeAddress}</span>
              <div
                style={{
                  // position: 'absolute',
                  // bottom: '0px',
                  fontSize: '1.5em'
                }}
              >
                Travel Time from Real Estate: XX.XX margin
              </div>
              {/* <CategoryToggleDiv>
                <input
                  type="button"
                  value={this.state.categoryExpanded ? 'Less' : 'More'}
                  onClick={() => this.toggleCategory()}
                />
              </CategoryToggleDiv> */}
            </CategoryInformation >
          </div>
          {/* <SmoothCollapse expanded={this.state.categoryExpanded}>
                <div> Bro do you even expand </div>
          </SmoothCollapse > */}
          <Arrow
              title='Left Arrow'
              onClick={this.state.categoryCounter > 0 ? this.minusOneCategoriesCounter : ""}
              left='0px'
              windowWidth={window.innerWidth}
            /> 
          <Arrow
              title='Right Arrow'
              onClick={this.plusOneCategoriesCounter}
              right='0px'
              windowWidth={window.innerWidth}
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
