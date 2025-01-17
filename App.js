import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const cameraRef = useRef(null); 
  const [facing, setFacing] = useState('back');
  const [torchEnabled, setTorchEnabled] = useState(false); 
  const [permission, requestPermission] = useCameraPermissions(); 

  function ensureCameraPermission() {
    if (!permission?.granted) {
      requestPermission();
    }
  }

  useEffect(() => {
    ensureCameraPermission();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ marginBottom: 10 }}>Acesso à câmera necessário</Text>
        <Button onPress={ensureCameraPermission} title="Conceder Permissão" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((prevFacing) => (prevFacing === 'back' ? 'front' : 'back'));
  }

  function toggleTorch() {
    setTorchEnabled((prevTorchEnabled) => !prevTorchEnabled);
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        Alert.alert('Foto capturada!');
        console.log(photo.uri);
      } catch (error) {
        Alert.alert('Erro ao capturar a foto', error.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef} 
        style={styles.camera}
        facing={facing}
        enableTorch={torchEnabled}
      >
        <View style={styles.topButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleTorch}>
            <MaterialIcons name={torchEnabled ? 'flash-on' : 'flash-off'} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-android" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  bottomButtons: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'rgba(0,0,0,0.2)',
  },
});
