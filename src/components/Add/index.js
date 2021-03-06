import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';

import { loading, loaded } from '../../actions/loading';
import post from '../../services/postClue';
import './style.css';

class Add extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			dialog: false,
			snackbar: false,
			snackbarMessage: '',
			description: '',
			fileName: '',
			file: null,
			loop: false,
		};
	}

	// handle file selection
	handleFileChange = event => {
		const fileName = event.target.value.slice(event.target.value.lastIndexOf('\\') + 1);
		this.setState({ fileName, file: event.target.files[0] });
	};

	// handle clue description
	handleDescriptionChange = event => this.setState({ description: event.target.value });

	// handle opening of the upload dialog
	handleClick = () => this.setState({ dialog: true });

	// cancel upload
	handleCancel = () =>
		this.setState({
			dialog: false,
			snackbar: false,
			description: '',
			fileName: '',
			file: null,
			loop: false,
		});

	// handle upload
	handleConfirm = () => {
		// contruct the clue
		const data = {
			description: this.state.description,
			type: this.props.accept || 'text',
			roomId: this.props.roomId,
			atmosphere: this.props.atmosphere || false,
		};
		if (this.state.file) data.newFile = this.state.file;
		if (this.props.atmosphere) data.loop = this.state.loop;
		// and post it to the server
		this.props.loading();
		post(data, message => {
			setTimeout(() => {
				this.props.loaded();
				this.setState({
					dialog: false,
					snackbar: true,
					snackbarMessage: message,
					description: '',
					fileName: '',
					file: null,
					loop: false,
				});
			}, 1000);
		});
	};

	// close the snackbar
	handleSnackbarClose = () => {
		this.setState({ snackbar: false, snackbarMessage: '' });
	};

	handleToggle = (e, v) => {
		this.setState({ loop: !this.state.loop });
	};

	render() {
		const actions = [
			<FlatButton label="Annuler" secondary onTouchTap={this.handleCancel} />,
			<FlatButton
				label="Ok"
				primary
				disabled={
					this.state.description.length <= 0 ||
						(this.state.fileName.length <= 0 && this.props.accept)
				}
				onTouchTap={this.handleConfirm}
			/>,
		];
		return (
			<div className="add">
				<IconButton
					iconStyle={{ width: 24, height: 24, color: 'rgb(164, 198, 57)' }}
					tooltip={`Ajouter ${this.props.atmosphere ? 'une ambiance' : 'un indice'}`}
					tooltipPosition="bottom-center"
					onTouchTap={this.handleClick}
				>
					<ContentAddCircle />
				</IconButton>
				<Dialog
					title={`Ajouter ${this.props.atmosphere ? 'une ambiance' : 'un indice'}`}
					actions={actions}
					modal={true}
					open={this.state.dialog}
				>
					{this.props.accept &&
						<div>
							<TextField
								hintText="Aucun fichier de sélectionné"
								value={this.state.fileName}
								disabled
							/>
							<RaisedButton
								icon={<FileFileUpload color="#ffffff" />}
								backgroundColor="#a4c639"
								className="a-input-file"
							>
								<input
									type="file"
									accept={`${this.props.accept}/*`}
									onChange={this.handleFileChange}
								/>
							</RaisedButton>
						</div>}
					<TextField
						hintText="Veuillez saisir description"
						value={this.state.description}
						onChange={this.handleDescriptionChange}
						ref={c => {
							if (c) c.focus();
						}}
						className="a-input-desc"
					/>
					{this.props.atmosphere &&
						<Toggle
							className="a-toggle"
							label="Média en boucle"
							toggled={this.state.loop}
							onToggle={this.handleToggle}
						/>}
				</Dialog>
				<Snackbar
					open={this.state.snackbar}
					message={this.state.snackbarMessage}
					autoHideDuration={3000}
					onRequestClose={this.handleSnackbarClose}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = Object.assign({ loading, loaded });

export default connect(state => state, mapDispatchToProps)(Add);
