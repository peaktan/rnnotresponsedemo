/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Animated} from 'react-native';
import {FadeAnimated} from './animated';

const Dialog = (props: any) => {
  const animated = useMemo(() => {
    return new FadeAnimated({});
  }, []);
  const animatedState = animated ? animated.getState() : {};

  useEffect(() => {
    if (props.visible) {
      animated.toIn();
    } else {
      animated.toOut();
    }
  }, [animated, props.visible]);

  if (!props.visible) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transform: [{scale: animatedState.scale}],
            opacity: animatedState.opacity,
          },
        ]}>
        <View
          style={{
            width: 200,
            height: 150,
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>{props.bodyText}</Text>
          <TouchableOpacity
            style={{
              width: 100,
              height: 36,
              backgroundColor: 'yellow',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
            }}
            onPress={props.confirmCallback}>
            <Text>关闭</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

function App(): React.JSX.Element {
  const [show, setShow] = React.useState(false);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          setShow(true);
        }}>
        <Text>显示弹框</Text>
      </TouchableOpacity>
      <Dialog
        visible={show}
        confirmCallback={() => {
          setShow(false);
        }}
        bodyText="测试动画弹框出现后无法点击消失"
        confirmLabelText="确认"></Dialog>
    </View>
  );
}

export default App;
