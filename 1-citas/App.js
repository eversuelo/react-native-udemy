import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  Alert
} from 'react-native'
import Formulario from './src/components/Formulario'
import Paciente from './src/components/Paciente';
import InformacionPaciente from './src/components/InformacionPaciente';

const App = () => {

  const [modalVisible, setModalVisible] = useState(false)
  const [pacientes, setPacientes] = useState([])
  const [paciente, setPaciente] = useState({})
  const [modalPaciente, setModalPaciente] = useState(false)
  useEffect(() => {
    //Obtener Pacientes de Storage
    obtenerPacientesStorage()
  }, [])
  useEffect(() => {
    //Guardar Pacientes en Storage
    guardarPacientesStorage()
  }, [pacientes])

  const pacienteEditar = id => {
    const pacienteEditar = pacientes.filter(paciente => paciente.id === id)
    setPaciente(pacienteEditar[0])
  }
  const obtenerPacientesStorage = async () => {
    try {
      const pacientesStorage = await AsyncStorage.getItem('pacientes')
      console.log(pacientesStorage);
      if (pacientesStorage) {
        setPacientes(JSON.parse(pacientesStorage))
      }
    } catch (error) {
      console.log(error)
    }
  }
  const guardarPacientesStorage = async () => {
    try {
      await AsyncStorage.setItem('pacientes', JSON.stringify(pacientes))
    } catch (error) {
      console.log(error)
    }
  }
  const pacienteEliminar = id => {
    Alert.alert(
      '¿Deseas eliminar este paciente?',
      'Un paciente eliminado no se puede recuperar',
      [
        { text: 'Cancelar' },
        {
          text: 'Si, Eliminar', onPress: () => {
            const pacientesActualizados = pacientes.filter(pacientesState => pacientesState.id !== id)
            setPacientes(pacientesActualizados)
          }
        }
      ]
    )
  }

  const cerrarModal = () => {
    setModalVisible(false)

  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Administrador de Citas {''}
        <Text style={styles.tituloBold}>Veterinaria</Text>
      </Text>

      <Pressable
        style={styles.btnNuevaCita}
        onPress={() => setModalVisible(!modalVisible)}
      >
        <Text
          style={styles.btnTextoNuevaCita}
        >Nueva Cita</Text>
      </Pressable>

      {pacientes.length === 0 ?
        <Text style={styles.noPacientes}>No hay pacientes aún</Text> :
        <FlatList
          style={styles.listado}
          data={pacientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Paciente
                item={item}
                setModalVisible={setModalVisible}
                setPaciente={setPaciente}
                pacienteEditar={pacienteEditar}
                pacienteEliminar={pacienteEliminar}
                setModalPaciente={setModalPaciente}
              />
            )
          }}
        />
      }


      {modalVisible && (
        <Formulario
          cerrarModal={cerrarModal}
          pacientes={pacientes}
          setPacientes={setPacientes}
          paciente={paciente}
          setPaciente={setPaciente}
        />
      )}

      <Modal
        visible={modalPaciente}
        animationType='slide'
      >
        <InformacionPaciente
          paciente={paciente}
          setPaciente={setPaciente}
          setModalPaciente={setModalPaciente}
        />
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    flex: 1
  },
  titulo: {
    textAlign: 'center',
    fontSize: 30,
    color: '#374151',
    fontWeight: '600'
  },
  tituloBold: {
    fontWeight: '900',
    color: '#6D28D9',
  },
  btnNuevaCita: {
    backgroundColor: '#6D28D9',
    padding: 15,
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 10
  },
  btnTextoNuevaCita: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  noPacientes: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600'
  },
  listado: {
    marginTop: 50,
    marginHorizontal: 30
  }
})

export default App;