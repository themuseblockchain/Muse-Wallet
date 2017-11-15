import React, {Component, PropTypes} from 'react'
import { hashHistory  } from 'react-router'
import {isLoggedIn} from '../helpers/Authentication.jsx'

import muse from 'museblockchain-js'
import localConfig from '../config.json'
muse.configure(localConfig);

class PostContent extends Component {
        constructor(props) {
            super(props);
            this.state = {};

        
        }

        componentWillMount() {
        if(!isLoggedIn()) {
            hashHistory.push('/login');
        }
    }

    postContent() {

        let username = window.localStorage.getItem('username');

        let password = window.localStorage.getItem('password');

        muse.broadcast.content(

                password,
            ///
                username,

                $('#url').val(),
                {
          "part_of_album": false,///Boolean($('#part_of_album').val()),
          "album_title": $('#album_title').val(),
          "album_artist": [],
          "genre_1": parseInt($('#album_genre_one').val()),
          "country_of_origin": $('#country_of_origin').val(),
          "explicit_": parseInt($('#explicit').val()),
          "p_line": $('#album_p_line').val(),
          "c_line": $('#album_c_line').val(),
          "upc_or_ean": $('#upc_or_ean').val(),
          "release_date": parseInt($('#release_date').val()),
          "release_year": parseInt($('#release_year').val()),
          "sales_start_date": parseInt($('#sales_start_date').val()),
          "master_label_name": $('#master_label_name').val(),
          "display_label_name": $('#display_label_name').val()
        },
        {
          "track_title": $('#track_title').val(),
          "ISRC": $('#isrc_code').val(),
          "track_artists": [],
          "genre_1": parseInt($('#track_genre_one').val()),
          "p_line": $('#p_line').val(),
          "track_no": parseInt($('#track_number').val()),
          "track_volume": parseInt($('#track_volume').val()),
          "track_duration": 1625362368,
          "samples": false///Boolean($('#samples').val())
        },
        {
          "composition_title": $('#composition_title').val(),
          "third_party_publishers": false,///Boolean($('#third_party').val()),
          "publishers": [],
          "writers": [],
          "PRO": ""
        },
              
                [{
                    "payee": username,
                    "bp": 10000
                  }
                ],
                [{
                    "voter": username,
                    "percentage": 100
                  }
                ],
        100,
    [],
    [],
        100,
        10,
        5000
    ///
    , function(err, result){console.log(err, result);

  });
    }

    render() {
        return (
            <div className="wallet-container margin-top-50 margin-bottom-65 tabs-wrapper">
                <h3><p>Posting Artist Content Information</p></h3>

                <div className="form-group margin-top-50">

                <h1>Album Data:</h1>
    
                <input className="form-control" name="URL" id="url" placeholder="Content URL IPFS or AWS Address" size="50"/>

                <input className="form-control" name="Album Title" id="album_title" placeholder="Album Title"/>
                
                <input className="form-control" name="Album Genre" id="album_genre" placeholder="Album Genre"/>  
                
                <input className="form-control" name="Country of Origin" id="country_of_origin" placeholder="Country of Origin"/>
                
                <input className="form-control" name="UPC or EAN" id="upc_or_ean" placeholder="UPC or EAN"/>
                
                <input className="form-control" name="Release Date" id="release_date" placeholder="Release Date"/>
                
                <input className="form-control" name="Release Year" id="release_year" placeholder="Release Year" />
                
                <input className="form-control" name="Sales Start Date" id="sales_start_date" placeholder="Sales Start Date" />
                  
                <input className="form-control" name="Master Label Name" id="master_label_name" placeholder="Master Label Name"  />
                
                <input className="form-control" name="Display Label Name" id="display_label_name" placeholder="Display Label Name" />

                <h1>Track Data:</h1>

                <input className="form-control" name="Track Title" id="track_title" placeholder="Track Title"/>
    
                <input className="form-control" name="ISRC code" id="isrc_code" placeholder="ISRC code"/>
      
                <input className="form-control" name="Track Number" id="track_number" placeholder="Track Number"/>
    
                <input className="form-control" name="Copyright Number" id="copyright_number" placeholder="Copyright Number" />

                <h1>Composition Data:</h1>

                <input className="form-control" name="Composition Title" id="composition_title" placeholder="Composition Title" />

                </div>

                <div className="form-group margin-top-50">
                    <button type="button" className="btn btn-primary" onClick={this.postContent}>Post Content</button>
                </div>                            

                <div className={`loader-wrapper ${this.state.loading ? 'visible' : 'hidden'}`}></div>
                <div className={`loader-container ${this.state.loading ? 'visible' : 'hidden'}`}>
                    <div className="loader-cell">
                        <i className="fa fa-refresh fa-spin fa-5x fa-fw"></i>
                    </div>
                </div>
            </div>
        )
    }

}

export default PostContent;