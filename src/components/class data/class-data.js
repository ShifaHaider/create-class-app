import React, {Component} from 'react';
import firebase from 'firebase'
import firestore from 'firebase/firestore'
import {pinkA200} from "material-ui/styles/colors";
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';



class ClassInformation extends Component {
    db = firebase.firestore();
    constructor(props) {
        super(props);
        this.classId = props.match.params.id;
        this.state = {
            class: {},
            lectures:{
            titleChap: '',
            descriptionSub: '',
            videoUrl: ''},
            open: false
        };
        this.ref = this.db.collection('Classes').doc(this.classId);
       this.classRef = this.ref.collection('Lectures');
        this.classData();

    }
    classData() {
         this.ref.get().then((doc) => {
            var docData = doc.data();
            this.setState({class: docData});
        })

    }
    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    textChange(p, e) {
        var lectures = this.state.lectures;
        lectures[p] = e.target.value;
        this.setState({lectures: lectures});
        console.log(this.state.lectures);
    }

    addLectures(){
        var  lectures = this.state.lectures;
        this.classRef.add(lectures);
    }
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}/>,
            <FlatButton
                label="Add"
                primary={true}
                keyboardFocused={true}
                onClick={this.addLectures.bind(this)}/>,
        ];

        return (
            <div>
            <AppBar title={'View class ' + this.state.class.title}/>
                <Card>
                    <CardTitle title={this.state.class.title}/>
                    <CardText>{this.state.class.description}</CardText>
                    <CardText>{new Date(this.state.class.classStartTime).toTimeString()}</CardText>
                    <CardText>{new Date(this.state.class.classEndTime).toTimeString()}</CardText>
                    <CardText>{this.state.class.creatdAt}</CardText><br/>
                    <div>
                    <RaisedButton label='Start Class..' primary={true} onClick={this.handleOpen} />
                        <Dialog
                            actions={actions}
                            modal={false}
                            open={this.state.open}
                            onRequestClose={this.handleClose}>
                            <TextField hintText="Title" floatingLabelText="Title"
                            value={this.state.lectures.titleChap} onChange={this.textChange.bind(this, 'titleChap')}/><br/>
                            <TextField hintText="Description" floatingLabelText="Description"
                            value={this.state.lectures.descriptionSub} onChange={this.textChange.bind(this, 'descriptionSub')}/><br/>
                            <TextField hintText="Video URL" floatingLabelText="Video URL"
                            value={this.state.lectures.videoUrl} onChange={this.textChange.bind(this, 'videoUrl')}/>
                        </Dialog>
                    </div>
                </Card>
            </div>
        )
    }
}

export default ClassInformation;