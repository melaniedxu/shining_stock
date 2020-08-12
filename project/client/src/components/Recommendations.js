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
					if (!recList) return;
					let recDivs = recList.map((rec, i) =>
						<RecommendationsRow key={i} rec={rec}></RecommendationsRow>				
					);
					console.log(recDivs);
				this.setState({
					recStocks: recDivs
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
			<div className="Recommendations">
				<PageNavbar active="recommendations" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron" style={hStyle}>
			    		<div className="h2">Have a stock in mind already?</div>
			    		<br></br>
						<div className="h6">Enter a stock that you think have potential. We'll recommend based on that.</div>
			    		<div className="input-container">
			    			<input type='text' class="form-control form-control-lg" placeholder="Enter a ticker, e.g. V" value={this.state.stockName} onChange={this.handleStockNameChange} id="stockName" className="stock-input"/>
			    			<br></br>
							<br></br>
							<button id="submitStockBtn" class="btn btn-outline-dark btn-sm" onClick={this.submitStock}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    		<br></br>
			    			<div class="h5">We think you may like ...</div>
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