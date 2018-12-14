import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {Toolbar, ToolbarGroup} from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DownloadIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';

import LiveVideo from '../../../../../../utils/LiveVideo';
import AnalyticsUtil from '../../../../../../utils/AnalyticsUtil';
import {onStoryAuthorUsernameClicked, getStorySlide} from '../../../../../../utils/Utils';

class LiveFriendVideosList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: -1
    }
  }
  
  onShareStory(index) {
    var selectedStory = this.props.liveVideoItems[index];
    AnalyticsUtil.track("Share Story", AnalyticsUtil.getStoryObject(selectedStory));
    window.open('https://watchmatcha.com/user/' + selectedStory.broadcast_owner.username);
  }
  
  render() {
    if(this.props.liveVideoItems.length === 0) {
      return (<div></div>);
    }
    
    const friendStoriesListData = this.props.liveVideoItems.map((liveVideoItem, key) => {
      var src = liveVideoItem.cover_frame_url;
      const name = liveVideoItem.broadcast_owner.username;
      const isPrivate = liveVideoItem.broadcast_owner.is_private;
      
      return (
        <div key={key} style={{marginBottom: '20px', maxWidth: '293px'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', background: 'white', borderRadius: '3px', border: '1px solid #e6e6e6'}}>
            <ListItem
              disabled
              primaryText={
                <div style={{cursor: 'pointer'}} title={name} onClick={() => onStoryAuthorUsernameClicked(liveVideoItem)}>{name.substr(0, 14) + (name.length > 14 ? '…' : '')}</div>
              }
              secondaryText={'LIVE'}
              innerDivStyle={{fontSize: '13px', fontWeight: 600}}
              leftAvatar={<Avatar src={liveVideoItem.broadcast_owner.profile_pic_url} style={{cursor: 'pointer'}} onClick={() => onStoryAuthorUsernameClicked(liveVideoItem)}/>}
              />
            <div style={{flexDirection: 'row', position: 'absolute', right: '10px'}}>
              <IconButton
                tooltip={(isPrivate) ? "Can't Share Private Story" : "Share"}
                disabled={isPrivate}
                onClick={() => this.onShareStory(key)}>
                <ShareIcon />
              </IconButton>
            </div>
          </div>
          
          <LiveVideo liveItem={liveVideoItem}/>
        </div>
      )
    });
    
    return (
      <div>
        {friendStoriesListData}
      </div>
    )
  }
}

export default LiveFriendVideosList;