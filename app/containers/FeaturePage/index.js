/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import CheckboxForm from '../GoogleMapContents/CheckboxForm';
// import CategoryToggleDiv from '../GoogleMapContents/CategoryToggleDiv';
import CategoryToggleDiv from '../../components/CategoriesCard/CategoryToggleDiv';
import SmoothCollapse from '../../utils/ReactSmoothCollapse';

export default class FeaturePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

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
    return (
      <div>
        <Helmet
          title="Feature Page"
          meta={[
            { name: 'description', content: 'Feature page of React.js Boilerplate application' },
          ]}
        />
        <H1>
          <FormattedMessage {...messages.header} />
        </H1>
        <CheckboxGroup 
          name="mapOptions" 
          value={["gym"]} 
          onChange={(e) => {console.log("check box change")}}
        >
          <CheckboxForm 
            alignment="column"
          >
            {//  /* eslint says label has to have htmlFor, but that breaks checkbox label clicking, there is no way to make a lint comment out in render portion of JSX */}
            /* eslint-disable */
            }
            <label>
              <Checkbox value="convenience_store" /> Plan for the Journey
              <CategoryToggleDiv>
                <input
                  type="button"
                  value={this.state.categoryExpanded ? 'Less' : 'More'}
                  onClick={() => this.toggleCategory()}
                />
              </CategoryToggleDiv>
              <SmoothCollapse expanded={this.state.categoryExpanded}>
                <div> Bro do you even expand </div>
                <label>
                  <Checkbox value="school" /> Start Scouting
                </label>
                <label>
                  <Checkbox value="school" /> Start Scouting
                </label>
              </SmoothCollapse >
            </label>
            <label>
              <Checkbox value="gym" /> Set Expectations
            </label>
            <label>
              <Checkbox value="grocery_or_supermarket" /> Research, Research, Research
            </label>
            <label>
              <Checkbox value="subway_station" /> Get Equiped (Pre-approval)
            </label>
            <label>
              <Checkbox value="school" /> Start Scouting
            </label>
            <label>
              <Checkbox value="meal_takeaway" /> More Scouting
            </label>
            <label>
              <Checkbox value="restaurant" /> Prep Paperwork
            </label>
            <label>
              <Checkbox value="library" /> Poker Face, Stick to WHAT YOU KNOW
            </label>
            <label>
              <Checkbox value="museum" /> Reflection
            </label>
            {/* eslint-enable */}
          </CheckboxForm>
        </CheckboxGroup>

        <List>
          <ListItem>
            <ListItemTitle>
              <FormattedMessage {...messages.scaffoldingHeader} />
            </ListItemTitle>
            <p>
              <FormattedMessage {...messages.scaffoldingMessage} />
            </p>
          </ListItem>

          <ListItem>
            <ListItemTitle>
              <FormattedMessage {...messages.feedbackHeader} />
            </ListItemTitle>
            <p>
              <FormattedMessage {...messages.feedbackMessage} />
            </p>
          </ListItem>

          <ListItem>
            <ListItemTitle>
              <FormattedMessage {...messages.routingHeader} />
            </ListItemTitle>
            <p>
              <FormattedMessage {...messages.routingMessage} />
            </p>
          </ListItem>

          <ListItem>
            <ListItemTitle>
              <FormattedMessage {...messages.networkHeader} />
            </ListItemTitle>
            <p>
              <FormattedMessage {...messages.networkMessage} />
            </p>
          </ListItem>

          <ListItem>
            <ListItemTitle>
              <FormattedMessage {...messages.intlHeader} />
            </ListItemTitle>
            <p>
              <FormattedMessage {...messages.intlMessage} />
            </p>
          </ListItem>
        </List>
      </div>
    );
  }
}
