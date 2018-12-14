import React, { Component } from 'react';
import {Toolbar, ToolbarGroup} from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';;
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import DownloadIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import CircularProgress from '@material-ui/core/CircularProgress';
import InstagramApi from '../../../../../utils/InstagramApi';
import {downloadStory, getStorySlide, getTimeElapsed} from '../../../../../utils/Utils';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import {setCurrentStoryObject} from '../../utils/PopupUtils';
import {countriesList} from '../../../../../static/js/locationData.js'

class LocationsList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: -1,
      downloadingIndex: -1,
      isDownloadingStory: false,
      stories: []
    }
  }
  
  componentDidMount() {
    setTimeout(function() {
      this.setState({stories: countriesList});
    }.bind(this), 100);  
  }
  
  handleRequestChange (event, index) {
    InstagramApi.getLocationStory(this.state.stories[index].locationId, (story) => {
      setCurrentStoryObject('USER_STORY', story);
      this.setState({
        selectedIndex: index,
      });
    });
  }
  
  onDownloadStory(index) {
    if(!this.state.isDownloadingStory) {
      this.setState({
        isDownloadingStory: true,
        downloadingIndex: index
      });
      InstagramApi.getLocationStory(this.state.stories[index].locationId, (story) => {
        if(story) {
          downloadStory(story, () => this.setState({isDownloadingStory: false}));
        } else {
          setCurrentStoryObject('USER_STORY', null);
          this.setState({isDownloadingStory: false});
        }
      });
    }
  }
  
  onShareStory(index) {
    var selectedStory = this.state.stories[index];
    AnalyticsUtil.track("Share Story", {locationName: selectedStory.name, locationId: selectedStory.locationId});
    window.open('https://watchmatcha.com/location/' + selectedStory.locationId);
  }
  
  render() {
    const locationStoriesListData = this.state.stories.map((locationStory, key) => {
      return (
        <ListItem
          key={key}
          value={key}
          innerDivStyle={{paddingTop: '0px', paddingBottom: '0px'}}>
          <Toolbar style={{paddingTop: '0px', paddingBottom: '0px', background: 'transparent'}}>
            <ToolbarGroup firstChild={true}>
              <ListItem
                disabled
                primaryText={locationStory.name}
                leftAvatar={<Avatar>{locationStory.emoji}</Avatar>}
                innerDivStyle={{marginLeft: '-14px'}}
                />
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
              <IconButton
                tooltip={"Share"}
                onClick={() => this.onShareStory(key)}>
                <ShareIcon />
              </IconButton>
              <IconButton
                tooltip="Download"
                onClick={() => this.onDownloadStory(key)}>
                {(this.state.isDownloadingStory && this.state.downloadingIndex === key) ? <CircularProgress size={24}/> : <DownloadIcon />}
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
        </ListItem>
      )
    });
    
    return (
      <List onChange={this.handleRequestChange.bind(this)}>
        <ListSubheader>Location Stories</ListSubheader>
        {locationStoriesListData}
      </List>
    )
  }
}

export default LocationsList;