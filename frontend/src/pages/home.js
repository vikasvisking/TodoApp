import React, { Component } from 'react';

import Todo from '../components/todo';
import AddBasket from '../components/basket';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import NotesIcon from '@material-ui/icons/Notes';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

const drawerWidth = 240;

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '45%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
});

class home extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			uiLoading: false,
			imageLoading: false,
			render: false,
			open: false,
			openAlert: false,
			message: ''
		};
		this.todos = React.createRef();
	}

	loadTodoPage = (event) => {
		this.setState({ render: false });
	};

	handleBasket = () => {
		this.setState(preState => ({
			open: !preState.open
		}))
	}

	logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		this.props.history.push('/login');
	};

	handleAlert = (message) => {
		this.setState({
			message: message,
			openAlert: true
		})
	}

	handleBasketAdd = () => {
		console.log('handlBasketAdd')
		this.setState({
			open: false,
			message: "Basket is successfully added",
			openAlert: true
		})
		this.todos.current.getTodos()
	}

	handleAlertClose = () => {
	  this.setState({
		message: "",
		openAlert: false
	  })
	}

	render() {
		const { classes } = this.props;
		const { open, openAlert, message } = this.state;
		
		if (this.state.uiLoading === true) {
			return (
				<div className={classes.root}>
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</div>
			);
		} else {
			return (
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" noWrap>
								TodoApp
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<List>
							<ListItem button key="Todo" onClick={this.loadTodoPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Todo" />
							</ListItem>

							<ListItem button key="Baskets" onClick={this.handleBasket}>
								<ListItemIcon>
									{' '}
									<ShoppingBasketIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Add Baskets" />
							</ListItem>

							<ListItem button key="Logout" onClick={this.logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
					</Drawer>
					<div>
						<Snackbar open={openAlert} autoHideDuration={6000} onClose={this.handleAlertClose}>
							<Alert onClose={this.handleAlertClose} severity="success">
								{ message }
							</Alert>
						</Snackbar>
						<Todo ref={this.todos} handleAlert={this.handleAlert} />
					<AddBasket open={open} handleClose={this.handleBasket} Success={this.handleBasketAdd} />
					</div>
				</div>
			);
		}
	}
}

export default withStyles(styles)(home);
