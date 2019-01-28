import React, { Component } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import styles from './styles';

export default class Search extends Component {

  state = {
    searchFocused: false
  }

  render() {

    const { onLocationSelected } = this.props;

    return (
      <GooglePlacesAutocomplete
        placeholder="Para onde?"
        placeholderTextColor="#333"
        onPress={onLocationSelected}
        query={{
          key: 'AIzaSyDvwP-qqqRox-nKml20C6NB5reri9BfJK8',
          language: 'pt'
        }}
        textInputProps={{
          onFocus: () => { this.setState({ searchFocused: true }) },
          onBlur: () => { this.setState({ searchFocused: false }) },
          autoCapitalize: 'none',
          autoCorrect: false
        }}
        listViewDisplayed={this.state.searchFocused}
        fetchDetails
        enablePoweredByContainer={false}
        styles={styles}
      />
    );
  }
}
