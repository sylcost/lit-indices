import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {
	List,
	ListItem
} from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';

import C from '../../constants';
import Confirm from '../Confirm';
import removeClue from '../../services/removeClue';
import './style.css';

class ClueList extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			dialog: false,
			snackbar: false,
			snackbarMessage: ''
		};
	}

	handleEmit = (clue) => {
		const channel = this.props.atmosphere ? 'send atmosphere' : 'send clue';
		this.props.socket.emit(channel, clue);
	}

	// press for starting supression
	handleClear = (id) => {
		this.setState({
			dialog: true,
			clearId: id
		});
	}

	// confirm suppression
	handleConfirm = () => {
		removeClue(this.state.clearId, (message) => {
			this.setState({
				dialog: false,
				snackbar: true,
				snackbarMessage: message,
			});
		});

	}

	// cancel suppression
	handleCancel = () => {
		this.setState({ dialog: false });
	}

	// close the snackbar
	handleSnackbarClose = () => {
		this.setState({ snackbar: false, snackbarMessage: '' });
	};

	render() {
		const items = this.props.clues.map((clue) => {
			return (
				<ListItem
					key={clue._id}
					primaryText={clue.description}
					leftAvatar={clue.type === 'image' ? (
						<Avatar src={`${C.SERVER_HOST}:${C.SERVER_PORT}/uploads/${clue.fileName}`} />
					) : (
						null
					)}
					rightIconButton={this.props.admin ?
						<IconButton>
							<ContentClear onTouchTap={this.handleClear.bind(this, clue._id)} />
						</IconButton> :
						null
					}
					onTouchTap={this.handleEmit.bind(this, clue)}
				/>
			);
		});
		return (
			<div className="cl-container">
				<List>
					{items}
				</List>
				<Confirm
					open={this.state.dialog}
					handleConfirm={this.handleConfirm}
					handleCancel={this.handleCancel}
				/>
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

export default ClueList;
