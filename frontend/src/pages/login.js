// Material UI components
import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	}
});

class login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			errors: [],
			loading: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if("errors" in nextProps.UI){
			if (nextProps.UI.errors) {
			this.setState({
				errors: nextProps.UI.errors
			});
		}
		}
		
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const userData = {
			username: this.state.email,
			password: this.state.password
		};
		axios
			.post('http://localhost:8000/api/auth-token', userData)
			.then((response) => {
				localStorage.setItem('AuthToken', `Token ${response.data.token}`);
				this.setState({
					loading: false
				});
				this.props.history.push('/');
			})
			.catch((error) => {
				
				this.setState({
					errors: {
						email: 'Invalid credentials',
						password: 'Invalid credentials',
					},
					loading: false
				});
			});
	};

	render() {
		const { classes } = this.props;
		const { errors, loading } = this.state;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Login
					</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							helperText={errors.email}
							error={errors.email ? true : false}
							onChange={this.handleChange}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							helperText={errors.password}
							error={errors.password ? true : false}
							onChange={this.handleChange}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={this.handleSubmit}
							disabled={loading || !this.state.email || !this.state.password}
						>
							Sign In
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
					</form>
				</div>
			</Container>
		);
	}
}

export default withStyles(styles)(login);
