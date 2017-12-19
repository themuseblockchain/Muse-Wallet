import React, {Component, PropTypes} from 'react'
import { hashHistory  } from 'react-router'
import {isLoggedIn} from '../helpers/Authentication.jsx'

import muse from 'muse-js'
import localConfig from '../config.json'
muse.configure(localConfig);

class PostContent extends Component {
        constructor(props) {
            super(props);
            this.state = {
              part_of_album: false,///
              samples: false,///
              third_party_publishers: false,///
              explicit_: false,///
              url: '',///
              album_title: '',///
              country_of_origin: '',///
              p_line: '',
              c_line: '',
              master_label_name: '',///
              display_label_name: '',///
              track_title: '',///
              track_p_line: '',
              composition_title: '',///
              PRO: '',
              album_artist: [],
              track_artists: [],
              publishers: [],
              writers: [],
              genre_1: 0,///
              upc_or_ean: 0,///
              release_date: 0, //Validate///
              release_year: 0, //Validate///
              sales_start_date: 0, //Validate///
              ISRC: 0, //Validate///
              track_genre_1: 0,
              track_no: 0,///
              track_volume: 0,
              track_duration: 0,
              loading: false
            };

            this.changeObject = this.changeObject.bind(this);
            this.handlePartofalbum = this.handlePartofalbum.bind(this);
            this.handleSamples = this.handleSamples.bind(this);
            this.handleThirdparty =this.handleThirdparty.bind(this);
            this.handleExplicit = this.handleExplicit.bind(this);

        }

        componentWillMount() {
        if(!isLoggedIn()) {
            hashHistory.push('/login');
        }
    }

    changeObject(e) {

      console.log(e);

      var object = e.target.name;

      console.log("this is the object", object);

      let content = e.target.value;

      console.log("this is the content", content);

      this.setState({object : content});

      window.localStorage.setItem(object, content);
    };

    handlePartofalbum(e) {
        let part_of_album = window.localStorage.getItem('part_of_album');
        console.log(e.target);
        let partofalbum_status = e.target.checked;
        this.setState({part_of_album: partofalbum_status});
        console.log(e.target);
        console.log(part_of_album);
    };

    handleSamples(e) {
        console.log(e);
        let samples_status = e.target.true;
        this.setState({samples: samples_status});
        console.log();
    };

    handleThirdparty(e) {
        console.log(e);
        let thirdparty_status = e.target.true;
        this.setState({third_party_publishers: thirdparty_status});
        console.log();
    };

    handleExplicit(e) {
        console.log(e);
        let explicit_status = e.target.true;
        this.setState({explicit_: explicit_status});
        console.log(explicit_);
    };



    postContent() {

        let username = window.localStorage.getItem('username');

        let password = window.localStorage.getItem('password');

        let url = window.localStorage.getItem('url');

        let album_title = window.localStorage.getItem('album_title');

        let part_of_album = window.localStorage.getItem('part_of_album');

        let album_artist = window.localStorage.getItem('album_artist');

        let genre_1 = window.localStorage.getItem('genre_1');

        let country_of_origin = window.localStorage.getItem('country_of_origin');

        let explicit_ = window.localStorage.getItem('explicit_');

        let p_line = window.localStorage.getItem('p_line');

        let c_line = window.localStorage.getItem('c_line');

        let upc_or_ean = window.localStorage.getItem('upc_or_ean');

        let release_date = window.localStorage.getItem('release_date');

        let release_year = window.localStorage.getItem('release_year');

        let sales_start_date = window.localStorage.getItem('sales_start_date');

        let master_label_name = window.localStorage.getItem('master_label_name');

        let display_label_name = window.localStorage.getItem('display_label_name');

        let track_title = window.localStorage.getItem('track_title');

        let ISRC = window.localStorage.getItem('ISRC');

        let track_artists = window.localStorage.getItem('track_artists');

        let track_genre_1 = window.localStorage.getItem('track_genre_1');

        let track_p_line = window.localStorage.getItem('track_p_line');

        let track_no = window.localStorage.getItem('track_no');

        let track_volume = window.localStorage.getItem('track_volume');

        let track_duration = window.localStorage.getItem('track_duration');

        let samples = window.localStorage.getItem('samples');

        let composition_title = window.localStorage.getItem('composition_title');

        let third_party_publishers = window.localStorage.getItem('third_party_publishers');

        let publishers = window.localStorage.getItem('publishers');

        let writers = window.localStorage.getItem('writers');

        let pro = window.localStorage.getItem('pro');

        console.log(window.localStorage);



        muse.broadcast.content(

        password,
            ///
        username,

        url,
        {
          "part_of_album": part_of_album.split(" ")[1],
          "album_title": album_title,
          "album_artist": [username],
          "genre_1": genre_1,
          "country_of_origin": country_of_origin,
          "explicit_": explicit_,
          "p_line": p_line,
          "c_line": c_line,
          "upc_or_ean": upc_or_ean,
          "release_date": release_date,
          "release_year": release_year,
          "sales_start_date": sales_start_date,
          "master_label_name": master_label_name,
          "display_label_name": display_label_name
        },
        {
          "track_title": track_title,
          "ISRC": ISRC,
          "track_artists": [username],
          "genre_1": genre_1,
          "p_line": track_p_line,
          "track_no": track_no,
          "track_volume": track_volume,
          "track_duration": track_duration,
          "samples": samples
        },
        {
          "composition_title": composition_title,
          "third_party_publishers": third_party_publishers,
          "publishers": publishers,
          "writers": writers,
          "PRO": pro
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
                <h3><p>Posting Content Information</p></h3>

                <div className="form-group margin-top-50">

                <div className="checkbox">
                                <label><input type="checkbox" checked={this.state.unchecked}
          onChange={this.handlePartofalbum} name="part_of_album"/>Content is part of an album?</label>
                            </div>
                <div className="checkbox">
                                <label><input type="checkbox" name="samples" />Content has sample tracks?</label>
                            </div>
                <div className="checkbox">
                                <label><input type="checkbox" name="third_party_publishers" />Content is third party managed?</label>
                            </div>
                <div className="checkbox">
                                <label><input type="checkbox" name="explicit_" />Content is explicit?</label>
                            </div>

                <h1>Album Data:</h1>

                <input className="form-control" name="url" onChange={this.changeObject} placeholder="Content URL IPFS" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="album_title" onChange={this.changeObject} placeholder="Album Title" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="genre_1" onChange={this.changeObject} placeholder="Album Genre" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="country_of_origin" onChange={this.changeObject} placeholder="Country of Origin" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="upc_or_ean" onChange={this.changeObject} placeholder="UPC or EAN" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="release_date" onChange={this.changeObject} placeholder="Release Date" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="release_year" onChange={this.changeObject} placeholder="Release Year" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="sales_start_date" onChange={this.changeObject} placeholder="Sales Start Date" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="master_label_name" onChange={this.changeObject} placeholder="Master Label Name" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="display_label_name" onChange={this.changeObject} placeholder="Display Label Name" onKeyPress={this.handleKeyPress}/>

                <h1>Track Data:</h1>

                <input className="form-control" name="track_title" onChange={this.changeObject} placeholder="Track Title" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="ISRC" onChange={this.changeObject} placeholder="ISRC code" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="track_no" onChange={this.changeObject} placeholder="Track Number" onKeyPress={this.handleKeyPress}/>

                <h1>Composition Data:</h1>

                <input className="form-control" name="composition_title" onChange={this.changeObject} placeholder="Composition Title" onKeyPress={this.handleKeyPress}/>

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
