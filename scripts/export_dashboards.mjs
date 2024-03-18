/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import fs from 'fs';

 const res = await fetch('https://monitoring.internal.cke-cs-dev.com/api/search?query=&starred=false', { 
 	headers: {'Authorization': 'Basic ' + btoa('cks:pass')}
})

 const dashboards = await res.json();

 for (const dashboard of dashboards ) {
	const res = await fetch(`https://monitoring.internal.cke-cs-dev.com/api/dashboards/uid/${ dashboard.uid }`,  { 
		headers: {'Authorization': 'Basic ' + btoa('cks:pass')}
  })
	const dashboardData = await res.json();
	fs.writeFileSync(
		`./infrastructure/grafana/dashboards/${dashboard.title.replace(' ', '-').toLowerCase()}.json`,
		JSON.stringify(dashboardData.dashboard, null, 2)
	)
 }