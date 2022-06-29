import { Alert, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Icon, Input } from 'react-native-elements';
import AppButton from '../../Components/UI/AppButton';
import { GlobalStyles } from '../../../GlobalStyle';
import { Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { getLoginApi } from '../../Services/appServices/loginService';
import { storeUserData } from '../../Services/store/slices/profileSlice';
import LoadingContainer from '../../Components/UI/LoadingContainer';
import Filter from '../../Components/UI/Filter';
import { GetCounterDetail } from '../../Services/appServices/VehicleManagementService';
import { LoginBtn } from '../../Components/UI/cButtons';
// import Calendar from 'react-native-nepali-date-picker'

const windowWidth = Dimensions.get('window').width;
const windowheight = Dimensions.get('window').height

const LoginScreen = () => {
  const [errors, setErrors] = useState({});
  const [UserName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [IsLoading, setIsLoading] = useState(false);
  const [IsDisabled, setIsDisabled] = useState(false);
  const [ShowPassword, setShowPassword] = useState(true);
  const [CounterName, setCounterName] = useState('');
  const [CounterId, setCounterId] = useState();
  const [IsVisible, setIsVisible] = useState(false);
  const [CounteList, setCounteList] = useState();

  const validate = () => {
    Keyboard.dismiss();
    let isOpValid = true
    if (UserName === '' || UserName === undefined) {
      handleError('please enter Username', 'UserName')
      isOpValid = false
    }
    if (Password === '' || Password === undefined) {
      handleError('please enter Password', 'Password')
      isOpValid = false
    }
    if (CounterName === '' || CounterName === undefined) {
      handleError('please enter Counter Name', 'CounterName')
      isOpValid = false
    }

    return isOpValid;
  }

  const handleError = (error, input) => {
    setErrors(prevState =>
      ({ ...prevState, [input]: error }));
  };

  const handleProceed = () => {
    let isValidated = validate();
    setIsDisabled(true);
    setIsLoading(true);
    // return
    let data = {
      'username': UserName,
      'password': Password,
    }
    // return
    if (isValidated) {
      dispatch(getLoginApi(data, (res, status) => {

        if (status === 200) {
          // console.log("user response", res?.UserDetails[0]);

          let uData = {
            "Role": res?.UserDetails[0].Role,
            "RoleId": res?.UserDetails[0].RoleId,
            "UId": res?.UserDetails[0].UId,
            "UserContactNumber": res?.UserDetails[0].UserContactNumber,
            "UserFullName": res?.UserDetails[0].UserFullName,
            "UserName": res?.UserDetails[0].UserName,
            "counterId": CounterId !== undefined ? CounterId : '',
          }

          // console.log('user data 2', uData)
          dispatch(storeUserData(uData));

        } else {
          Alert.alert(
            'त्रुटि!',
            "प्रयोगकर्ता नाम र पासवर्ड मिलेन।",
            [
              {
                text: 'ठिक छ', onPress: () => {
                  setIsDisabled(false);
                  setIsLoading(false);
                }
              }
            ]
          )
        }
      }))
    } else {
      Alert.alert(
        "सतर्कता !",
        "कृपया आवश्यक डाटा भर्नुहोस्।",
        [
          {
            text: 'ठिक छ', onPress: () => {
              setIsDisabled(false);
              setIsLoading(false);
            }
          }
        ]
      )
    }
    setIsDisabled(false);
    setIsLoading(false);
  }

  const handleSelect = (cId, counterName) => {
    setCounterName(counterName)
    setCounterId(cId)
    setIsVisible(!IsVisible);
    // setIsInputDisable(!IsInputDisable)
  }

  useEffect(() => {
    const controller = new AbortController();
    dispatch(GetCounterDetail((res) => {
      setCounteList(res?.CounterDetails)
    }))
    return () => {
      // cancel the subscription
      controller.abort();
    };
  }, [])


  return (

    // <View style={[GlobalStyles.mainContainer]}>

    <KeyboardAvoidingView
      behavior={Platform === 'ios' ? 'padding' : 'height'}
      style={styles.logincontainer}>

      {/* <View > */}
      <View style={{
        alignItems: 'center'
      }}>
        <Image source={require('../../../assets/images/bus.png')} style={styles.logo}></Image>
      </View>
      <View style={styles.dummyInputContainer}>
        <Text style={styles.dummyTitle}>Counter:</Text>
        <Pressable onPress={() => {
          setIsVisible(!IsVisible)
          handleError(null, 'CounterName')
        }}
          // disabled={IsInputDisable}
          style={styles.dummyInput}
        >
          <Icon
            name={'shopping-store'}
            color={'#c9c0c0'}
            type={'fontisto'}
            style={styles.icon}
            size={20}
          ></Icon>
          <Text style={styles.dummyInputTxt}>{CounterName}</Text>
        </Pressable>
        <Text style={{
          fontSize: 12,
          color: 'red'
        }}> {errors.CounterName ? errors.CounterName:""}</Text>
      </View>
      <Input
        value={UserName}
        placeholder='User Name'
        onChangeText={(e) => setUserName(e)}
        onFocus={() => handleError(null, 'UserName')}
        label="User Name"
        errorMessage={errors.UserName}
        inputStyle={{
          fontSize: 14,
          color: '#5c5656',
        }}
        leftIcon={
          <Icon
            name={'user'}
            color={'#c9c0c0'}
            type={'antdesign'}
            style={styles.icon}
            size={20}
          ></Icon>
        }
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: '#dad8d8',
          paddingHorizontal: 3,
          borderRadius: 4,
          backgroundColor: '#faf4f4',
          marginTop: 4,
          // color: 'red';
          // marginBottom: -12,
        }}
      />

      <Input
        value={Password}
        placeholder='Password'
        onChangeText={(e) => setPassword(e)}
        onFocus={() => handleError(null, 'Password')}
        label="Password"
        errorMessage={errors.Password}
        secureTextEntry={ShowPassword}
        leftIcon={
          <Icon
            name={'key'}
            color={'#c9c0c0'}
            type={'antdesign'}
            style={styles.icon}
            size={20}
          ></Icon>
        }
        rightIcon={
          <Pressable onPressIn={() => {
            setShowPassword(!ShowPassword)
          }}
            onPressOut={() => {
              setShowPassword(!ShowPassword)
            }}
          >
            <Icon
              name={'eyeo'}
              color={'#c9c0c0'}
              type={'antdesign'}
              // style={styles.icon}
              size={20}
            ></Icon>
          </Pressable>

        }
        inputStyle={{
          fontSize: 14,
          color: '#5c5656',
        }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: '#dad8d8',
          paddingHorizontal: 3,
          borderRadius: 4,
          backgroundColor: '#faf4f4',
          marginTop: 4,
          // color: 'red';
          // marginBottom: -12,
        }}
      />

      <LoginBtn title={"लग - इन"} onPress={() => handleProceed()} IsDisabled={IsDisabled}></LoginBtn>

      <Modal
        animationType="slide"
        transparent={true}
        visible={IsVisible}
        onRequestClose={() => {
          setIsVisible(!IsVisible);
          // setIsInputDisable(!IsInputDisable)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <Filter data={CounteList} returnData={handleChangeVehicle} forVehicleList /> */}
            <ScrollView>
              {
                (CounteList !== undefined) &&

                CounteList.map(e => (
                  <Pressable style={styles.selectCard} onPress={() => handleSelect(e.CId, e.CounterName)} key={e.CId}>

                    <Text>{e.CounterName}</Text>
                  </Pressable>
                ))
              }
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* </View> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={IsLoading}
      >
        <View style={GlobalStyles.mainContainer}>
          <LoadingContainer />
        </View>
      </Modal>
    </KeyboardAvoidingView>



  )
}

export default LoginScreen

const styles = StyleSheet.create({
  logincontainer: {
    // width: width - 20,
    flex: 1,
    justifyContent: 'center'
    // paddingTop: 40,
    // backgroundColor: '#fefefe'
  },
  logo: {
    width: 200,
    height: 100,
  },
  icon: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    borderColor: '#c9c0c0'
  },
  dummyInputContainer: {
    width: windowWidth - 16,
    marginLeft: 8,
    // borderWidth: 1,
    marginBottom: 10,
  },
  dummyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#878991",
  },
  dummyInput: {
    backgroundColor: '#f8f7f7',
    // fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 4,
    // color: "#5c5656",
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c9c0c0'
  },
  dummyInputTxt: {
    fontSize: 14,
    color: "#8d8686",
    marginLeft: 4,
  },
  centeredView: {
    backgroundColor: "#fefefe",
    bottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1,
    // height: 300,
    alignItems: 'center',
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  modalView: {
    width: windowWidth - 16,
    height: windowheight * 0.5,
  },
  selectCard: {
    width: windowWidth - 16,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    marginTop: 4,
    borderRadius: 4,
    borderColor: '#c7c2c2'
  }
})