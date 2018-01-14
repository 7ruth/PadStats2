import React from 'react';
import Arrow from '../Arrow';
import A from './A';
import HeadingDiv from './HeadingDiv'
import CategoryDiv from './CategoryDiv'
import ImagePOI from './ImagePOI'
import SmoothCollapse from '../../utils/ReactSmoothCollapse';
import CategoryToggleDiv from './CategoryToggleDiv';
import CategoryInformation from './CategoryInformation';
import { defaultCategories } from "../../containers/GoogleMapTemplate/index";
class CategoriesCard extends React.Component { // eslint-disable-line

  constructor(props) {
    super(props);
    this.state = {
      categoryCounter: 0,
      categoryExpanded: false
    };
  }

  toggleCategory() {
    this.setState({ categoryExpanded: !this.state.categoryExpanded });
  }

  render() {
    const { category, 
            categoryData, 
            changeCounter, 
            distanceData, 
            id, 
            pushCategoryToTheTop
          } = this.props;

    let placeName;
    let placeRating;
    let placeAddress;
    let placeTravelTime;
    let cardContent;
    let imageSrc;
    let imageDimensions;
    let commuteCost;

    if (categoryData) {
      console.log('categoryData')
      console.log(categoryData)
      const categorySelector = this.state.categoryCounter;
      commuteCost = categoryData.distanceData && categoryData.distanceData.commuteCost || "";
      placeName = categoryData.name;
      placeRating = categoryData.rating;
      placeAddress = categoryData.vicinity;
      placeTravelTime = (categoryData.distanceData && categoryData.distanceData.travelTime) ? categoryData.distanceData.travelTime : "";
      imageDimensions = window.innerWidth > 1024 ? Math.floor(window.innerWidth * (0.3)) : Math.floor(window.innerWidth  * (0.4));
      imageSrc = categoryData.photos && categoryData.photos['0'].getUrl({ maxWidth: imageDimensions, maxHeight: imageDimensions });
    }
              
    // set up to create a google search
    const placeNameSearchTerm = placeName.split(' ').join('+');
    const placeAddressSearchTerm = placeAddress.split(' ').join('+');
    const searchPlaceUrl = 'https://www.google.com/search?q=' + placeNameSearchTerm + '+' + placeAddressSearchTerm

    return (
      <CategoryDiv id={category + 'Category'}>
          <div 
            id={category + '_Category' + '_Content'}
            style={{
              width: window.innerWidth > 1024 ? '80%' : '100%',
              margin: '0 auto'
            }}
          >
            <a 
              href={searchPlaceUrl}
              target="_blank"
            > 
              {imageSrc && 
                <ImagePOI 
                  src={imageSrc} 
                  alt=''
                  windowWidth={window.innerWidth}
                />
              }
            </a>
            <CategoryInformation >
              <HeadingDiv
                color={defaultCategories[category][1]}
              >
                <A 
                  href={searchPlaceUrl}
                  target="_blank"
                  style={{
                    textDecoration: 'none',
                    color: defaultCategories[category][1],
                    paddingLeft: '1px'
                  }}
                >
                  {placeName}
                </A>
              </HeadingDiv>
              {placeTravelTime &&
                <div
                  style={{
                    marginTop: '-5px',
                    fontSize: '1.5em',
                    color: defaultCategories[category][1],
                  }}
                >
                  {/* <span>Distance: {placeTravelTime}</span><br /> */}  
                  <span>Distance [{placeTravelTime}] - Rating: {placeRating} </span><br />
                  <br/>
                  <span>You go to {(this.props.categories && defaultCategories[this.props.category][0])} {(this.props.categories && this.props.categories[category][1])} {(this.props.categories && (this.props.categories[category][1] > 1 ? 'times' : 'time'))} a week</span><br />
                  <span>Weekly Commute Cost: <b>[ <span style={{color: 'OrangeRed'}}>{commuteCost}</span> ]</b></span>
                  
                </div>
              }
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
          {/* only show pushToTheTop button on rows other than the first */}
          {(id !== 0) && 
            <Arrow
              icon='topArrow'
              title='PushToTop Arrow'
              onClick={()=> pushCategoryToTheTop(this.props.category)}
              left='55px'
              windowWidth={window.innerWidth}
              style={{
                height: '40%'
              }}
            /> }
          <Arrow
              icon='leftArrow'
              title='Left Arrow'
              onClick={evt => changeCounter(this.props.category, "minus")}
              left='0px'
              windowWidth={window.innerWidth}
            /> 
          <Arrow
              icon='rightArrow'
              title='Right Arrow'
              onClick={evt => changeCounter(this.props.category, "plus")}
              right='0px'
              windowWidth={window.innerWidth}
          />
      </CategoryDiv>
    );
  }
}

CategoriesCard.propTypes = {
  categoryData: React.PropTypes.object,
  categories: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  pushCategoryToTheTop: React.PropTypes.func
};

export default CategoriesCard;
