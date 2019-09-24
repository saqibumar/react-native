import React from 'react'
import {Text, TextInput, View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image, Button, Platform} from 'react-native'
import Constants from 'expo-constants'

export default class MoviesListScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Home',
        headerTintColor: 'teal',
        headerStyle: {
            backgroundColor: 'lightyellow',
        },
        headerRight: (
          null
        ),
      })    
    state = {
        dataSource: [],
        isLoading: false,
        isLoadingDetail: false,
        page: 1,
        error: null,
        refreshing: false,
        name: '',
        fetchError: null,
      }
    render(){
        let keyExtractor = ({item}, index) => {
            //console.log(item,'<><>', index, this.props.data.Search[index].imdbID);lo
            //imdbID
            return this.state.dataSource[index].imdbID+'_'+index;
        }
        const renderItem = ({item}) => {
            
            return(
                <TouchableOpacity style={{flex: 1, minWidth:'100%'}} 
                    onPress={ () => {
                        //console.log("item.imdbID = ", item)
                        this.props.navigation.navigate('MovieDetails',{
                            itemID: item.imdbID,
                            itemTitle: item.Title,
                            itemPoster: item.Poster,
                            })
                    }}>
                <View style={{flex: 1, minWidth:'90%', flexDirection: 'row', paddingTop: 10}} key={item.imdbID}>
                    <Image source={{uri: item.Poster}} style={{height:50, width:50}}></Image>
                    <View style={{padding:15}}>
                        <Text style={{fontWeight: 'bold'}}>{item.Title}</Text>
                        <Text>{item.Year} ({item.Type})</Text>
                    </View>
                </View>
                </TouchableOpacity>
            )
        }

     
      //console.log(">>>>>>",this.state.dataSource);
      
    if(this.state.dataSource && (this.state.fetchError && this.state.fetchError.Response==='True')){
        return(
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.getHandler('name')}
                    placeholder="Search..."
                />
                
                <FlatList 
                    data={this.state.dataSource}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReached={this.handleMore}
                    onEndReachedThreshold={2}
                    initialNumToRender={10} 
                    ListFooterComponent={()=>{
                            if(this.state.fetchError.totalResults>eval(this.state.page*10))
                            {
                                return(
                                    <ActivityIndicator/>
                                )
                            }
                            else{
                                return null;
                            }
                        }}
                    />
                

            </View>
        )
    }
    else if(this.state.fetchError && this.state.fetchError.Response==='False'){
        return(
            <View style={{flex: 1, padding: 20}}>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.getHandler('name')}
                    placeholder="Search..."
                    />    
              <Text>{this.state.fetchError.Error}</Text>
            </View>
          )
    }
    else{              
        return(
            <View style={{flex: 1, padding: 20}}>
            <TextInput
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.getHandler('name')}
                    placeholder="Search..."
                    />    
              <Text style={{paddingTop:10}}>No result</Text>
            </View>
          )  
    }

     /* if(this.state.isLoading){
        return(
            <View style={{flex: 1, padding: 20}}>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.getHandler('name')}
                    placeholder="Search..."
                    /> 
            <ActivityIndicator/>
            </View>
        )
    }  */
    
}

    handleMore = () => {
        console.log("INSIDE LOAD MORE");
        console.log("totalResults = ", this.state.fetchError.totalResults)
        console.log("pages = ", this.state.page)
        console.log("totalResults = ", eval(this.state.page*10))

        if(this.state.fetchError.totalResults>eval(this.state.page*10))
        {
            console.log("Loading more", this.state.name);
            this.setState({
                page: this.state.page+1,
                isLoading: true,
            },()=>{
                this.fetchMovies(this.state.name);
            })
            /* setTimeout(()=>{
                this.fetchMovies(this.state.name)
            },1000) */
        }
    }

    getHandler = key => val => {
        this.setState({[key]: val})
        this.setState({
            page: 1,
            dataSource: [],
            isLoading: true,
        })
        this.fetchMovies(val);
    }

    fetchMovies = (movies) => {
        this.setState({
          isLoading: true,
        });
        console.log("http://www.omdbapi.com/?apikey=d0afcd37&s="+movies+"&page="+this.state.page)
        fetch("http://www.omdbapi.com/?apikey=d0afcd37&s="+movies+"&page="+this.state.page,
        )
        .then(response => response.json())
        .then(result=>{
            this.setState({
                fetchError: result
              }) 

            
            if(result.totalResults>0)
            {
                this.setState({
                  dataSource: [...this.state.dataSource, ...result.Search],
                  isLoading: false,
                  page: this.state.page,
                })
                console.log("result.totalResults = ", result.totalResults);
            }
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
      flex: 1, padding: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: 'teal',
        padding:10
    }
  });