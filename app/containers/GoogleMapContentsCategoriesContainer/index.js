import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import CategoriesCard from '../../components/CategoriesCard';
import { makeSelectSearchResults, makeSelectCategories } from '../MapPage/selectors';

class CategoriesContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

// here we will have a loop to create all the cards
  // componentDidMount() {
  //   // console.log('placesContainer mounted');
  // }

  // componentWillReceiveProps(nextProps) {
  //   // console.log("PLACESINFO");
  //   // console.log(nextProps.searchResults);
  //   // if (nextProps.searchResults) {
  //   //   const objectKeys = Object.keys(nextProps.searchResults);
  //   //   console.log(objectKeys);
  //   // }
  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps !== this.props) {
  //     console.log("COMPONENTS PROPS HAVE CHANGED@@@@@@@@@@@@@@@")
  //   }
  // }
  leftArrowClick() {
    // categorySelector += 1;
    // console.log(categorySelector);
    console.log('arrow Click');
  }

  render() {
    const { searchResults, categories } = this.props;
// console.log("SEARCHRESULTS in PLACES CONTAINER!!!!!!")
// console.log(searchResults)
    return (
      <div>
        {searchResults && Object.keys(searchResults).map((category) => { // eslint-disable-line
          if (searchResults[category] && categories[category] !== undefined) {
            return (
              <CategoriesCard
                key={`${category}Card`}
                category={category}
                categoryData={searchResults[category]}
                categories={categories}
                leftArrowClick={this.leftArrowClick}
              />
            );
          }
        })}
      </div>
    );
  }
}

CategoriesContainer.propTypes = {
  searchResults: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  categories: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) { // eslint-disable-line
  return {
    // onMapOptionChange: (evt) => {
    //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //   dispatch(changeCategories(evt));
    // },
    // setInitialCategories: (initialCategories) => {
    //   dispatch(changeCategories(initialCategories));
    // },
    // updateSearchResults: (searchResults) => {
    //   dispatch(updateSearchResults(searchResults));
    // },
  };
}

const mapStateToProps = createStructuredSelector({
  searchResults: makeSelectSearchResults(),
  categories: makeSelectCategories(),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer);
