import React from 'react';
import $ from 'jquery';
import { Tabs, Spin } from 'antd';
import { API_ROOT, GEO_OPTIONS, POS_KEY, AUTH_PREFIX, TOKEN_KEY } from "../constants";
import { Gallery } from './Gallery';
import { CreatePostButton } from "./CreatePostButton";
import { WrappedAroundMap } from "./AroundMap"

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        posts: [],
        error: '',
        loadingPosts: false,
        loadingGeoLocation: false,
    }
    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({ loadingGeoLocation: true, error: '' });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({ error: 'geo location not supported' });
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        this.setState({ loadingGeoLocation: false, error: '' });
        const { latitude: lat, longitude: lon } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({ lat: lat, lon: lon }));
        this.loadNearbyPosts();
    }

    onFailedLoadGeoLocation = () => {
        this.setState({ loadingGeoLocation: false, error: 'Failed to load geo location!' });

    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading geolocation ..."/>
        } else if (this.state.loadingPosts) {
            return <Spin tip="Loading posts ..."/>
        } else if (this.state.posts) {
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                };
            });

            return (
                <Gallery
                    images={images}
                />
            );
        }
        return null;
    }

    loadNearbyPosts = () => {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        //const { lat, lon } = {"lat":37.5629917,"lon":-122.32552539999998};
        this.setState({loadingPost: true});
        return $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
            },
        }).then((response) => {
            console.log(response);
            this.setState({ posts: response, loadingPost: false , error: ''});
        }, (error) => {
            this.setState({ error: error.responseText, loadingPost: false });
        }).catch((error) => {
            this.setState({ error: error.responseText });
        });
    }

    render() {
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
            <Tabs tabBarExtraContent={createPostButton} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    <WrappedAroundMap
                        posts={this.state.posts}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
