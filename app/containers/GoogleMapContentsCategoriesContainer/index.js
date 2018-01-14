import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import CategoriesCard from '../../components/CategoriesCard';
import { makeSelectSearchResults, makeSelectCategories } from '../MapPage/selectors';
import { changeCategories, changeCategoryForDirections, updateDirectionResults, startUpdateDirectionResults, updateSearchResults } from '../MapPage/actions'

class CategoriesContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  
  render() {
    const { categories,
            updateCategories,
            searchResults,
            updateCategoryForDirection,
            startUpdateDirectionResults } = this.props;
    
    function changeCounter(category, direction) {
      let counter;
      if (direction === "minus") { // if - to category counter
        // make sure to never decrease counter below 0 (loop back to end of array)
        counter = (categories[category][0] - 1) >= 0 ? (categories[category][0] - 1) : (searchResults[category].places.length - 1)
      } else { // if + to category counter and if exceeds the lenght of available results, loop back to 0
        counter = (categories[category][0] + 1 < searchResults[category].places.length ? categories[category][0] + 1 : 0)
      }
      // code in the new counter into the 0th position of the category array
      categories[category][0] = counter;
      // record it into a new object
      const newCategories = Object.assign({}, categories, { [category]: categories[category] });
      // start the dispatch -> action process to update store with new categories (and counters)
      updateCategories(newCategories);
      // specify which category is targeted
      updateCategoryForDirection(category);
      // trigger directions update for the map render
      startUpdateDirectionResults();
    };

    function pushCategoryToTheTop(category) {
        if (categories[category]) {
          // clean out previous pushToTop category
          categories[categoryDisplayOrder[0]][2] = 0;
          // set new push to the top
          categories[category][2] = 1;
          // record it in a new categories object
          let newCategories = Object.assign({}, categories, { [category]: categories[category], [categoryDisplayOrder[0]]: categories[[categoryDisplayOrder[0]]] });
          updateCategories(newCategories);
        }
    }

  let categoryDisplayOrder = [];
  let pushToTop;

  if (searchResults && categories) {
    // sort the order of the categories for display
    Object.keys(searchResults).map((category, index) => { // eslint-disable-line
      if (searchResults[category] && categories[category] !== undefined) {
        if (categories[category][2] === 1) {
          pushToTop = category;
        } else {
          categoryDisplayOrder.push(category);
        }
      }
    });
    categoryDisplayOrder.unshift(pushToTop);
  }
  
    return (
      <div>
        {searchResults && categoryDisplayOrder.map((category, index) => { // eslint-disable-line
          if (searchResults[category] && categories[category] !== undefined) {
            console.log('index!')
            console.log(index)
            return (
              <CategoriesCard
                id={index}
                key={`${category}Card`}
                category={category}
                categories={categories}
                categoryData={searchResults[category].places[categories[category][0]]}
                changeCounter={changeCounter}
                pushCategoryToTheTop={pushCategoryToTheTop}
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
    updateCategories: (newCategories) => {
      dispatch(changeCategories(newCategories));
    },
    updateCategoryForDirection: (targetCategory) => {
      dispatch(changeCategoryForDirections(targetCategory));
    },
    startUpdateDirectionResults: () => {
      dispatch(startUpdateDirectionResults());
    },
    updateSearchResults: (updatedSearchResults) => {
      dispatch(updateSearchResults(updatedSearchResults));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  searchResults: makeSelectSearchResults(),
  categories: makeSelectCategories(),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer);
