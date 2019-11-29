import React, {useState} from 'react'
import { Link } from "gatsby"

import Layout from "../components/layout"

export default function ProductPage({ pageContext}) {
	const {
		name,
		description,
		dimensions,
		units,
		price
	} = pageContext
	const baseUnit = units.find(unit => unit.isBase === true)
	const nonBaseUnits = units.filter(unit => unit.isBase === false)
	const [selectedUnit, setSelectedUnit] = useState(baseUnit.name)
	const derivedPrice = price * units.find(u => u.name === selectedUnit).factor

	function handleUnitSelect(e) {
		e.preventDefault()
		setSelectedUnit(e.currentTarget.value)
	}
	return (
		<Layout>
			<article>
				<h1>
					{ name }
				</h1>
				<p>
					{description}
				</p>
				{dimensions.map(({ key, value }) => (
					<p key = { key }>
						<strong>
							{ `${key} `}
						</strong>
						{value}
					</p>
				))}
				<select onChange={handleUnitSelect}>
					<option value={baseUnit.name}>{baseUnit.name}</option>
					{nonBaseUnits.map(unit => (
						<option key = {unit.name} value={unit.name}>{unit.name}</option>
					))}
				</select>
				<br/>
				{`price: ${derivedPrice}`}
				<br/>
				<Link to='/'>Home</Link>
			</article>
		</Layout>
	)
}