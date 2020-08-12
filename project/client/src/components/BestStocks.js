import React from 'react';
import PageNavbar from './PageNavbar';
import BestStockRow from './BestStockRow';
import '../style/BestStocks.css';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestStocks extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: "",
			lastName: "",
			middleName: "",
			dob: "",
			interest: "",
			names: []
		};

		this.submitChange = this.submitChange.bind(this);
		this.handleFNChange = this.handleFNChange.bind(this);
		this.handleLNChange = this.handleLNChange.bind(this);
		this.handleMNChange = this.handleMNChange.bind(this);
		this.handleDOBChange = this.handleDOBChange.bind(this);
		this.handleInterestChange = this.handleInterestChange.bind(this);
	}

	handleFNChange(e) {
		this.setState({
			firstName: e.target.value
		});
	}

	handleLNChange(e) {
		this.setState({
			lastName: e.target.value
		});
	}

	handleMNChange(e) {
		this.setState({
			middleName: e.target.value
		});
	}

	handleDOBChange(e) {
		this.setState({
			dob: e.target.value
		});
	}

	handleInterestChange(e) {
		this.setState({
			interest: e.target.value
		});
	}

	submitChange() {
		// Send an HTTP request to the server.
		fetch(`http://localhost:8081/beststocks/${this.state.selectedType}-${this.state.selectedPrice}`,
			{
				method: 'GET' // The type of HTTP request.
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(bestList => {
				if (!bestList) return;
				let bestDivs = bestList.map((bestStock, i) =>
					<BestStockRow key={i} bestStock={bestStock}></BestStockRow>
				);
				// Set the state of the stocks list to the value returned by the HTTP response from the server.
				this.setState({
					stocks: bestDivs
				});
			}, err => {
				// Print the error if there is one.
				console.log(err);
			});
	} 

	render() {
		const hStyle = {
			backgroundColor: "lightblue",
      		padding: "10px",
			fontFamily: "Arial",
			textAlign: "center",
			color: "black"
		};
		return (
			<div className="BestStocks">
				<PageNavbar active="beststocks" />

				<div className="container beststocks-container" style={{backgroundColor: "lightblue"}}>
			      <div className="jumbotron" style={{backgroundColor: "lightblue"}}>
			        <h2 style={hStyle}>Type in volunteer info and find voter info instantly</h2>
					<div className="input-container">
			    		<input type='text' placeholder="First Name" value={this.state.firstName} onChange={this.handleFNChange} id="stockName" className="stock-input"/>
			    		<input type='text' placeholder="Middle Initial" value={this.state.middleName} onChange={this.handleLNChange} id="stockName" className="stock-input"/>
			    		<input type='text' placeholder="Last Name" value={this.state.lastName} onChange={this.handleMNChange} id="stockName" className="stock-input"/>
			    	</div>
					<br></br>
			        <div className="select-container">
			          <div className="dropdown-container">
						<h6> What kind of volunteer work are you interested in? </h6>
			            <select value={this.state.interest} onChange={this.handleInterestChange} className="dropdown" id="stocksDropdown">
			            	<option selected disabled value=''>Interested in ... </option>
			            	<option value="event-plan">Event Planning</option>
			            	<option value="canvas">Canvasing</option>
			            </select>
						<br></br>
						<br></br>
			            <button style={{backgroundColor: "skyblue"}} className="submit-btn" class="btn btn-outline-dark btn-sm" id="changeSubmitBtn" onClick={this.submitChange}>Find</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="stocks-container">
						<h4>Voter Info:  </h4>
			          <div className="stock">
			            <div className="header"><strong>Name</strong></div>
			    		<div className="header"><strong>Age</strong></div>
					    <div className="header"><strong>Location</strong></div>
					    <div className="header"><strong>Phone Number</strong></div>
					    <div className="header"><strong>Last Contact Date</strong></div>
			          </div>
			          <div className="stocks-container" id="results">
			            {this.state.stocks}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}