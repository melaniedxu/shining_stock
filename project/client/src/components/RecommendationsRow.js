import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="stockResults">
				<div className="ticker">{this.props.rec.ticker}</div>
				<div className="name">{this.props.rec.company}</div>
				<div className="sector">{this.props.rec.sector}</div>
				<div className="open">{this.props.rec.open}</div>
				<div className="high">{this.props.rec.high}</div>
			</div>
		);
	}
}
