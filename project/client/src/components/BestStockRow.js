import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestStockRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="stockResults">
				<div className="ticker">{this.props.bestStock.ticker}</div>
				<div className="name">{this.props.bestStock.company}</div>
				<div className="sector">{this.props.bestStock.sector}</div>
				<div className="open">{this.props.bestStock.open}</div>
				<div className="high">{this.props.bestStock.high}</div>
			</div>
		);
	}
}
