import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import {Colors, View, TextField} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native';

const CamaraScreen = () => {
  const [uriWebView, setUriWebView] = useState<string>('https://google.com');
  return (
    <View useSafeArea centerV centerH flex>
      <TextField
        placeholder={'Url'}
        floatingPlaceholder
        value={uriWebView}
        onChangeText={val => setUriWebView(val)}
        containerStyle={styles.textFieldContainer}
        fieldStyle={styles.withUnderline}
      />
      <View row flex>
        <WebView
          style={styles.webView}
          source={{uri: uriWebView}}
          startInLoadingState
          renderLoading={() => (
            <View useSafeArea>
              <ActivityIndicator size="large" color="lightskyblue" />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    borderWidth: 5,
    borderColor: '#1893F8',
  },
  textFieldContainer: {
    width: '100%',
  },
  withUnderline: {
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabledHeavy,
  },
});
export default CamaraScreen;
