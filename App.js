/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';


const imageX = 'https://png.icons8.com/metro/1600/delete-sign.png';
const imageO = 'http://cdn.onlinewebfonts.com/svg/img_168224.png';
const playOneVez = true;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1Name: 'Jogador X',
      placarX: 0,
      player2Name: 'Jogador O',
      placarO: 0,
      blocos: [],
      modalResultados: false,
      qtdVitoriasX: 0,
      qtdVitoriasO: 0,
      partidas: []
    }
  }
  componentWillMount() {
    this.iniciarJogo();
    AsyncStorage.getItem('@HistoricoGames').then((data) => {
      if (data) {
        this.setState({ partidas: JSON.parse(data) })
      }
    });
  }
  iniciarJogo() {
    let listaBloco = [];
    for (let x = 0; x < 9; x++) {
      listaBloco.push({ image: null, play: 0 });
    }
    this.setState({ blocos: listaBloco, jogoEncerrado: false, playOne: true });
  }
  marcaBloco(id) {
    if (!this.state.jogoEncerrado) {
      let listaBlocos = this.state.blocos;
      let playOneVez = this.state.playOne;
      if (listaBlocos[id].play == 0) {
        if (playOneVez) {
          listaBlocos[id].image = imageX;
          listaBlocos[id].play = 1;
        } else {
          listaBlocos[id].image = imageO;
          listaBlocos[id].play = 5;

        }
      }
      //Monta os novos blocos
      this.setState({ ...this.state, playOne: !playOneVez, blocos: listaBlocos });
      this.verificaVitoria(listaBlocos);
    }
  }


  verificaVitoria(blocos) {
    let vitoria = false;
    let vencedor = '';
    let vitoriaPlayOne = 3;
    let vitoriaPlayTwo = 15;
    let possibilidades = [];
    let partidas = this.state.partidas;
    let empates = [11, 7]
    let empate = 0;
    possibilidades.push({ total: (blocos[0].play + blocos[1].play + blocos[2].play) });
    possibilidades.push({ total: (blocos[3].play + blocos[4].play + blocos[5].play) });
    possibilidades.push({ total: (blocos[6].play + blocos[7].play + blocos[8].play) });

    possibilidades.push({ total: (blocos[0].play + blocos[3].play + blocos[6].play) });
    possibilidades.push({ total: (blocos[1].play + blocos[4].play + blocos[7].play) });
    possibilidades.push({ total: (blocos[2].play + blocos[5].play + blocos[8].play) });


    possibilidades.push({ total: (blocos[0].play + blocos[4].play + blocos[8].play) });
    possibilidades.push({ total: (blocos[2].play + blocos[4].play + blocos[6].play) });

    possibilidades.map(possibilidade => {
      if (possibilidade.total == vitoriaPlayOne) {
        vitoria = true;
        vencedor = this.state.player1Name;
      }
      else if (possibilidade.total == vitoriaPlayTwo) {
        vitoria = true;
        vencedor = this.state.player2Name;
      } else {
        if (empates.indexOf(possibilidade.total) !== -1) {
          ++empate;
        }
      }

    })

    if (vitoria) {
      partidas.push({ vencedor: vencedor })
      AsyncStorage.setItem('@HistoricoGames', JSON.stringify(partidas));

      Alert.alert('Jogo encerrado!', 'A vitória foi de ' + vencedor);
      this.setState({ ...this.state, qtdVitoriasX: vencedor == this.state.player1Name ? this.state.qtdVitoriasX + 1 : this.state.qtdVitoriasX, qtdVitoriasO: vencedor == this.state.player2Name ? this.state.qtdVitoriasO + 1 : this.state.qtdVitoriasO, jogoEncerrado: true });
    }
    if (empate == possibilidades.length) {
      partidas.push({ empate: 1 })
      AsyncStorage.setItem('@HistoricoGames', JSON.stringify(partidas));
      Alert.alert('Jogo encerrado!', 'O Jogo empatou');
      this.setState({ ...this.state, jogoEncerrado: true });

    }

  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container2}>
          <Text style={styles.textVez}>Vez do {this.state.playOne ? this.state.player1Name : this.state.player2Name}</Text>
        </View>
        <View style={styles.container3}>
          <Text style={{ fontSize: 18 }}>Vitórias: </Text>
          <Text style={{ fontSize: 18 }}>X: {this.state.qtdVitoriasX}</Text>
          <Text style={{ fontSize: 18, marginLeft: 20 }}>O: {this.state.qtdVitoriasO}</Text>
        </View>
        <View style={styles.containerBtns}>
          <TouchableOpacity style={styles.btnReset} onPress={() => this.iniciarJogo()}>
            <Text style={styles.textBtn}>Resetar</Text>

          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 20, backgroundColor: '#00b894', padding: 10 }} onPress={() => this.setState({ modalResultados: true })}>
            <Text style={styles.textBtn}>Histórico</Text>

          </TouchableOpacity>
        </View>
        <View style={styles.container}>

          <View style={{ flexDirection: 'row' }}>

            <TouchableOpacity onPress={() => this.marcaBloco(0)}>
              <View style={styles.campoBorder}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[0].image }} />

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.marcaBloco(1)}>
              <View style={styles.campoBorder}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[1].image }} />

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.marcaBloco(2)}>
              <View style={styles.campoLastBorder}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[2].image }} />

              </View>
            </TouchableOpacity>

          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.marcaBloco(3)}>
              <View style={styles.campoBorder}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[3].image }} />

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.marcaBloco(4)}>
              <View style={styles.campoBorder}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[4].image }} />

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.marcaBloco(5)}>
              <View style={styles.campoLastBorder}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[5].image }} />

              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.marcaBloco(6)}>
              <View style={styles.campoLast}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[6].image }} />

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.marcaBloco(7)}>
              <View  style={styles.campoLast}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[7].image }} />

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.marcaBloco(8)}>
              <View style={styles.campoNoBorder}>
                <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.blocos[8].image }} />

              </View>
            </TouchableOpacity>
          </View>

        </View>
        <Modal
          animationType={"fade"}
          transparent={false}
          visible={this.state.modalResultados}
          onRequestClose={() => { this.setState({ modalResultados: false }) }}>
          <View style={{ flex: 1, padding: 15, }}>
            <View style={{ marginTop: 10, alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
              <TouchableOpacity style={{ backgroundColor: '#0984e3', padding: 10 }} onPress={() => this.setState({ modalResultados: false })}>
                <Text style={{ fontSize: 18, color: 'white' }}>Voltar</Text>

              </TouchableOpacity>

            </View>
            <View style={{ borderBottomWidth: 1, padding: 15, flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Partida / Vencedor</Text>
            </View>
            <FlatList
              data={this.state.partidas}
              renderItem={({ item, index }) => <View style={{ borderBottomWidth: 1, padding: 10 }}>
                <Text>{index} - {item.vencedor ? item.vencedor + ' venceu' : 'EMPATE'}</Text>
              </View>}
            />
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container2: { alignItems: 'center', padding: 20 },
  container3: { paddingLeft: 20, flexDirection: 'row' },
  containerBtns: { paddingLeft: 20, marginTop: 15, flexDirection: 'row' },
  textVez: { fontSize: 22, color: 'black' },
  btnReset: { backgroundColor: '#d63031', padding: 10 },
  textBtn: { fontSize: 18, color: 'white' },
  campoBorder: { width: 120, height: 120, borderRightWidth: 1, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' },
  campoLastBorder: { width: 120, height: 120, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' },
  campoLast: { width: 120, height: 120, borderRightWidth: 1, alignItems: 'center', justifyContent: 'center' },
  campoNoBorder: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }
})
