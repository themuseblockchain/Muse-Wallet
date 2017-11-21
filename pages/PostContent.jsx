import React, {Component, PropTypes} from 'react'
import { hashHistory  } from 'react-router'
import {isLoggedIn} from '../helpers/Authentication.jsx'

import muse from 'museblockchain-js'
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

            this.changeUrl = this.changeUrl.bind(this);
            this.changeAlbum_Title = this.changeAlbum_Title.bind(this);
            this.changeAlbum_Genre = this.changeAlbum_Genre.bind(this);
            this.changeOrigin = this.changeOrigin.bind(this);
            this.changeUPC_EAN = this.changeUPC_EAN.bind(this);
            this.changeRelease_Date = this.changeRelease_Date.bind(this);
            this.changeRelease_Year = this.changeRelease_Year.bind(this);
            this.changeSale_Date = this.changeSale_Date.bind(this);
            this.changeMaster_Label_Name = this.changeMaster_Label_Name.bind(this);
            this.changeDisplay_Label_Name = this.changeDisplay_Label_Name.bind(this);
            this.changeTrack_Title = this.changeTrack_Title.bind(this);
            this.changeISRC = this.changeISRC.bind(this);
            this.changeTrack_Number = this.changeTrack_Number.bind(this);
            this.changeComposition_Title = this.changeComposition_Title.bind(this);
            this.changeHas_samples = this.changeHas_samples.bind(this);
            this.changeIs_explicit = this.changeIs_explicit.bind(this);
            this.changeIs_third_party = this.changeIs_third_party.bind(this);
            this.changeIs_part_of_album = this.changeIs_part_of_album.bind(this);      

        }

        componentWillMount() {
        if(!isLoggedIn()) {
            hashHistory.push('/login');
        }
    }

    changeUrl(e) {

        let url = e.target.value;
        this.setState({ url: url });

        window.localStorage.setItem("url", url);
    };

    changeAlbum_Title(e) {

        let album_title = e.target.value;
        this.setState({ album_title: album_title });

        window.localStorage.setItem("album_title", album_title);
    };

    changeAlbum_Genre(e) {

        let genre_1 = e.target.value;
        this.setState({ genre_1: genre_1 });

        window.localStorage.setItem("genre_1", genre_1);
    };

    changeOrigin(e) {

        let country_of_origin = e.target.value;
        this.setState({ country_of_origin: country_of_origin });

        window.localStorage.setItem("country_of_origin", country_of_origin);
    };

    changeUPC_EAN(e) {

        let upc_or_ean = e.target.value;
        this.setState({ upc_or_ean: upc_or_ean });

        window.localStorage.setItem("upc_or_ean", upc_or_ean);
    };

    changeRelease_Date(e) {

        let release_date = e.target.value;
        this.setState({ release_date: release_date });

        window.localStorage.setItem("release_date", release_date);
    };

    changeRelease_Year(e) {

        let release_year = e.target.value;
        this.setState({ release_year: release_year });

        window.localStorage.setItem("release_year", release_year);
    };

    changeSale_Date(e) {

        let sales_start_date = e.target.value;
        this.setState({ sales_start_date: sales_start_date });

        window.localStorage.setItem("sales_start_date", sales_start_date);
    };

    changeMaster_Label_Name(e) {

        let master_label_name = e.target.value;
        this.setState({ master_label_name: master_label_name });

        window.localStorage.setItem("master_label_name", master_label_name);
    };

    changeDisplay_Label_Name(e) {

        let display_label_name = e.target.value;
        this.setState({ display_label_name: display_label_name });

        window.localStorage.setItem("display_label_name", display_label_name);
    };

    changeTrack_Title(e) {

        let track_title = e.target.value;
        this.setState({ track_title: track_title });

        window.localStorage.setItem("track_title", track_title);
    };

    changeISRC(e) {

        let ISRC = e.target.value;
        this.setState({ ISRC: ISRC });

        window.localStorage.setItem("ISRC", ISRC);
    };

    changeTrack_Number(e) {

        let track_no = e.target.value;
        this.setState({ track_no: track_no });

        window.localStorage.setItem("track_no", track_no);
    };

    
    changeComposition_Title(e) {

        let composition_title = e.target.value;
        this.setState({ composition_title: composition_title });

        window.localStorage.setItem("composition_title", composition_title);
    };

    changeHas_samples(e) {

        let samples = e.target.value;
        this.setState({ samples: samples });

        window.localStorage.setItem("samples", samples);
    };

    changeIs_explicit(e) {

        let explicit_ = e.target.value;
        this.setState({ explicit_: explicit_ });

        window.localStorage.setItem("explicit_", explicit_);
    };

    changeIs_third_party(e) {

        let third_party_publishers = e.target.value;
        this.setState({ third_party_publishers: third_party_publishers });

        window.localStorage.setItem("third_party_publishers", third_party_publishers);
    };

    changeIs_part_of_album(e) {

        let part_of_album = e.target.value;
        this.setState({ part_of_album: part_of_album });

        window.localStorage.setItem("part_of_album", part_of_album);
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



        muse.broadcast.content(

        password,
            ///
        username,

        url,
        {
          "part_of_album": part_of_album,
          "album_title": album_title,
          "album_artist": album_artist,
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
          "track_artists": track_artists,
          "genre_1": track_genre_1,
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
                                <label><input type="checkbox" value="checked" onChange={this.changeIs_part_of_album} onKeyPress={this.handleKeyPress}/>Content is part of an album?</label>
                            </div>
                <div className="checkbox">
                                <label><input type="checkbox" value="checked" onChange={this.changeHas_samples} onKeyPress={this.handleKeyPress}/>Content has sample tracks?</label>
                            </div>
                <div className="checkbox">
                                <label><input type="checkbox" value="checked" onChange={this.changeIs_third_party} onKeyPress={this.handleKeyPress}/>Content is third party managed?</label>
                            </div>
                <div className="checkbox">
                                <label><input type="checkbox" value="checked" onChange={this.changeIs_explicit} onKeyPress={this.handleKeyPress}/>Content is Explicit?</label>
                            </div>

                <h1>Album Data:</h1>
    
                <input className="form-control" name="URL" onChange={this.changeUrl} placeholder="Content URL IPFS" onKeyPress={this.handleKeyPress}/>

                <input className="form-control" name="Album Title" onChange={this.changeAlbum_Title} placeholder="Album Title" onKeyPress={this.handleKeyPress}/>
                
                <input className="form-control" name="Album Genre" onChange={this.changeAlbum_Genre} placeholder="Album Genre" onKeyPress={this.handleKeyPress}/>  
                
                <input className="form-control" name="Country of Origin" onChange={this.changeOrigin} placeholder="Country of Origin" onKeyPress={this.handleKeyPress}/>
                
                <input className="form-control" name="UPC or EAN" onChange={this.changeUPC_EAN} placeholder="UPC or EAN" onKeyPress={this.handleKeyPress}/>
                
                <input className="form-control" name="Release Date" onChange={this.changeRelease_Date} placeholder="Release Date" onKeyPress={this.handleKeyPress}/>
                
                <input className="form-control" name="Release Year" onChange={this.changeRelease_Year} placeholder="Release Year" onKeyPress={this.handleKeyPress}/>
                
                <input className="form-control" name="Sales Start Date" onChange={this.changeSale_Date} placeholder="Sales Start Date" onKeyPress={this.handleKeyPress}/>
                  
                <input className="form-control" name="Master Label Name" onChange={this.changeMaster_Label_Name} placeholder="Master Label Name" onKeyPress={this.handleKeyPress}/>
                
                <input className="form-control" name="Display Label Name" onChange={this.changeDisplay_Label_Name} placeholder="Display Label Name" onKeyPress={this.handleKeyPress}/>

                <h1>Track Data:</h1>

                <input className="form-control" name="Track Title" onChange={this.changeTrack_Title} placeholder="Track Title" onKeyPress={this.handleKeyPress}/>
    
                <input className="form-control" name="ISRC code" onChange={this.changeISRC} placeholder="ISRC code" onKeyPress={this.handleKeyPress}/>
      
                <input className="form-control" name="Track Number" onChange={this.changeTrack_Number} placeholder="Track Number" onKeyPress={this.handleKeyPress}/>

                <h1>Composition Data:</h1>

                <input className="form-control" name="Composition Title" onChange={this.changeComposition_Title} placeholder="Composition Title" onKeyPress={this.handleKeyPress}/>

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