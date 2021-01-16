import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import { Box, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel  } from '@material-ui/core';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';
import { GetToDos, AddTodos, EditTodos, DeleteTodo } from '../requests/index'

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	formControl: {
		width: '100%',
	},
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 470
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12,
		marginTop: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class todo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			todos: '',
			title: '',
			body: '',
			todoId: '',
			errors: [],
			open: false,
			uiLoading: true,
			buttonType: '',
			baskets: [],
			selectbasket: '',
			done: false
		};

		this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	componentWillMount = async () => {
		authMiddleWare(this.props.history);
		await this.getTodos()
	};

	getTodos = async () => {
		const request = await GetToDos()
		if (request && request.status) {
			let todos = []
			let baskets = []
			request.data.forEach(item => {
				let todo_list = []
				if (item.todo_set) {
					todo_list = item.todo_set.map(todoitem =>  {
					  return {
						...todoitem,
						basket_id: item.id
					  }
					})
				}
				todos = [...todos, ...todo_list]
				baskets = [...baskets, { id: item.id, name: item.name }]
			});
			this.setState({
				todos: todos,
				baskets: baskets,
				uiLoading: false
			});
		} else {
			alert('Something went wrong')
			console.log(request);
		}
	}

	async deleteTodoHandler (data) {
		authMiddleWare(this.props.history);
		const status = window.confirm('Are you sure you want to delete this todo ?')
		if (status) {
			const item = {
				id: data.todo.id
			  }
			const response = await DeleteTodo(item)
			if (response && response.message) {
				this.getTodos();
				this.props.handleAlert(response.message)
			}
		}
	}

	handleEditClickOpen(data) {
		this.setState({
			title: data.todo.title,
			body: data.todo.description,
			todoId: data.todo.id,
			selectbasket: data.todo.basket_id,
			buttonType: 'Edit',
			open: true
		});
	}

	render() {

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, baskets, selectbasket, done } = this.state;

		const handleClickOpen = () => {
			this.setState({
				todoId: '',
				title: '',
				body: '',
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = async (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userTodo = {
				title: this.state.title,
				description: this.state.body,
				basket_id: this.state.selectbasket,
				basket: this.state.selectbasket,
				done: this.state.done
			};
			let response = undefined;
			if (this.state.buttonType === 'Edit') {
				userTodo.id = this.state.todoId
				response =  await EditTodos (userTodo)
			} else {
				response =  await AddTodos (userTodo)
			}
			
			if (response && response.status) { 
				this.setState({ open: false });
				this.getTodos()
			}
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Todo"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>
					<Dialog fullScreen maxWidth={'md'} open={open} onClose={handleClose} TransitionComponent={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									{this.state.buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
								</Typography>
								<Button
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
								</Button>
							</Toolbar>
						</AppBar>

						<form className={classes.form} noValidate>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="todoTitle"
										label="Todo Title"
										name="title"
										autoComplete="todoTitle"
										helperText={errors.title}
										value={this.state.title}
										error={errors.title ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<FormControl className={classes.formControl} variant="outlined">
										<InputLabel id="demo-simple-select-outlined">Select Basket</InputLabel>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											value={selectbasket}
											name="selectbasket"
											onChange={this.handleChange}
										>
											{
												baskets.map((item) => <MenuItem value={item.id} key={item.id}> {item.name}</MenuItem>)
											}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
								<FormControlLabel
										control={<Checkbox checked={done}
										onChange={(event) => {
											this.setState({
											  done: event.target.checked
											})
										}}
										name="done" />}
										label="Mark as done"
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="todoDetails"
										label="Todo Details"
										name="body"
										autoComplete="todoDetails"
										multiline
										rows={25}
										rowsMax={25}
										helperText={errors.body}
										error={errors.body ? true : false}
										onChange={this.handleChange}
										value={this.state.body}
									/>
								</Grid>
							</Grid>
						</form>
					</Dialog>

					<Grid container spacing={2}>
						{this.state.todos.map((todo) => (
							<Grid item xs={12} sm={6} key={todo.id + 'todo'}>
								<Card className={classes.root} variant="outlined">
									<CardContent>
										<Typography variant="h5" component="h2">
											{todo.title}
										</Typography>
										<Box display="flex" justifyContent="space-between" alignItems="center">
											<Typography className={classes.pos} color="textSecondary">
												{dayjs(todo.updated).fromNow()}
											</Typography>
											<Typography className={classes.pos} color="textSecondary">
												{todo.basket}
											</Typography>
										</Box>
										<Typography className={classes.pos} variant="subtitle1" component="p">
											Status: {
												todo.done ? 'Done' : 'Pending'
											}
										</Typography>
										<Typography variant="body2" component="p">
											{`${todo.description.substring(0, 65)}`}
										</Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
											Edit
										</Button>
										<Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
											Delete
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</main>
			);
		}
	}
}

export default withStyles(styles)(todo);
