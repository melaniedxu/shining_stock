import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected stock name,
		// and the list of recommended stocks.
		this.state = {
			stockName: "",
			recStocks: []
		}

		this.handleStockNameChange = this.handleStockNameChange.bind(this);
		this.submitStock = this.submitStock.bind(this);
	}

	handleStockNameChange(e) {
		this.setState({
			stockName: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	submitStock() {
		// Send an HTTP request to the server.
		fetch(`http://localhost:8081/recommendations/${this.state.stockName}`,
			{
				method: 'GET' // The type of HTTP request.
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(recList => {
					let recDivs = recList.map((rec, i) =>
						<RecommendationsRow key={i} rec={rec}></RecommendationsRow>
						);
				this.setState({
					recStocks: recDivs
				});
			}, err => {
				// Print the error if there is one.
				console.log(err);
			});
	}


	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="recommendations" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Recommendations</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Stock Name" value={this.state.stockName} onChange={this.handleStockNameChange} id="stockName" className="stock-input"/>
			    			<button id="submitStockBtn" className="submit-btn" onClick={this.submitStock}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">You may like ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Ticker</strong></div>
			    				<div className="header"><strong>Stock Name</strong></div>
					            <div className="header"><strong>Sector</strong></div>
					            <div className="header"><strong>Open Price</strong></div>
					            <div className="header"><strong>High Price</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recStocks}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}
