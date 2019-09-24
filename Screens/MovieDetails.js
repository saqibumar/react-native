import React from 'react'
import {Button, View, StyleSheet, Text, Image, ActivityIndicator, ScrollView, FlatList, ProgressBarAndroid, ProgressViewIOS, Platform} from 'react-native'


export default class MovieDetailsScreen extends React.Component {
    state = {
        isLoading: true,
        dataSource: '',
    }
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.getParam('itemTitle', 'xxx'),
        headerTintColor: '#a41034',
        headerStyle: {
            backgroundColor: 'lightyellow',
        },
        headerRight: (
          null
        ),
      })    

    componentDidMount(){
        const itemID = this.props.navigation.getParam('itemID', '')
        this.fetchDetails(itemID)
    }

    render(){
        //console.log(">>>>>", this.props.navigation.getParam('itemTitle', ''));
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
          }

        else {
            let keyExtractor = ({item}, index) => {
                return this.state.dataSource.Ratings[index].Value;
            }
            const renderItem = ({item}) => {

                let val=0;
                let ncolor = 'green'
                if(!item.Value.includes('%')){
                    val = eval(item.Value)
                    console.log("RATING = ", eval(item.Value))
                }
                else{
                    let num = item.Value.split('%')
                    val=num[0]/100;
                }
                if(val<0.5){
                    ncolor='red'
                }
                else if(val<0.7){
                    ncolor = 'yellow'
                }
                
                return(
                    
                    <View style={{flex: 1, minWidth:'90%', flexDirection: 'row'}} key={item.Source}>
                        <View style={{padding:5, flex: 1, justifyContent: "space-evenly"}}>
                            <Text>{item.Source} {item.Value}</Text>
                            {
                                ( Platform.OS === 'android' )?
                                ( 
                                    <ProgressBarAndroid 
                                        styleAttr="Horizontal"
                                        indeterminate={false}
                                        progress={val}
                                        color={ncolor}
                                    />

                                )
                                :
                                ( <ProgressViewIOS progress={val} style={{height:30}}
                                    progressTintColor={ncolor}
                                />  )
                            }
                            
                        </View>
                    </View>
                )
            }
            //Poster (Year), title, rated, Plot, Ratings[] with bars below 50% is red, above 70 is green
            return(
                <ScrollView style={{padding: 10, marginBottom:20}}>
                    <Image source={{uri: this.state.dataSource.Poster}} style={styles.image}></Image>
                    <Text style={{fontSize: 25, padding: 5,}}>{this.props.navigation.getParam('itemTitle', '')} ({this.state.dataSource.Year})</Text>
                    <Text style={{padding: 5, fontStyle: 'normal'}}>{this.state.dataSource.Rated}, {this.state.dataSource.Runtime}</Text>
                    <Text style={{padding: 5, fontStyle: 'italic'}}>{this.state.dataSource.Plot}</Text>

                    <FlatList 
                        data={this.state.dataSource.Ratings}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                    />
                </ScrollView>
            )
        }
    }

    fetchDetails = (itemID) => {
        this.setState({
          isLoading: true,
        });
        //console.log("http://www.omdbapi.com/?apikey=d0afcd37&i="+itemID)
        fetch("http://www.omdbapi.com/?apikey=d0afcd37&i="+itemID,
        )
        .then(response => response.json())
        .then(result=>{
          this.setState({
            dataSource: result,
            isLoading: false,
          })
          //console.log("DETAIL result", result)
          //console.log("TOTAL", result.totalResults)
        })
        .catch(error=>{
          console.log("ERROR = ",error);
          this.setState({
            isLoading: false,
          })
        });
      }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      textAlign: "center",
      justifyContent: "center",
    },
    image:{
        flex: 1,
        justifyContent: "center",
        height: 500, 
    },
  })
  