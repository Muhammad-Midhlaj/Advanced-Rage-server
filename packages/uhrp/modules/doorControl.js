const doorsInfo = [
	// Barber
	{ model: mp.joaat("v_ilev_hd_door_l"), position: new mp.Vector3(-823.2001, -187.0831, 37.819), locked: false },
	{ model: mp.joaat("v_ilev_hd_door_r"), position: new mp.Vector3(-822.4442, -188.3924, 37.819), locked: false },
	// Barber
	{ model: mp.joaat("v_ilev_bs_door"), position: new mp.Vector3(-29.8692, -148.1571, 57.2265), locked: false },
	// Barber
	{ model: mp.joaat("v_ilev_bs_door"), position: new mp.Vector3(133, -1711, 29), locked: false },
	// Barber
	{ model: mp.joaat("v_ilev_bs_door"), position: new mp.Vector3(-1287.857, -1115.742, 7.1401), locked: false },
	// Barber
	{ model: mp.joaat("v_ilev_bs_door"), position: new mp.Vector3(1932.952, 3725.154, 32.9944), locked: false },
	// Barber
	{ model: mp.joaat("v_ilev_bs_door"), position: new mp.Vector3(1207.873, -470.063, 66.358), locked: false },
	// Ponsonbys
	{ model: mp.joaat("v_ilev_ch_glassdoor"), position: new mp.Vector3(-716.6754, -155.42, 37.6749), locked: false },
	{ model: mp.joaat("v_ilev_ch_glassdoor"), position: new mp.Vector3(-715.6154, -157.2561, 37.6749), locked: false },
	// Ponsonbys
	{ model: mp.joaat("v_ilev_ch_glassdoor"), position: new mp.Vector3(-157.0924, -306.4413, 39.994), locked: false },
	{ model: mp.joaat("v_ilev_ch_glassdoor"), position: new mp.Vector3(-156.4022, -304.4366, 39.994), locked: false },
	// Ponsonbys
	{ model: mp.joaat("v_ilev_ch_glassdoor"), position: new mp.Vector3(-1454.782, -231.7927, 50.0565), locked: false },
	{ model: mp.joaat("v_ilev_ch_glassdoor"), position: new mp.Vector3(-1456.201, -233.3682, 50.0565), locked: false },
	// Suburban
	{ model: mp.joaat("v_ilev_clothmiddoor"), position: new mp.Vector3(-1201.435, -776.8566, 17.9918), locked: false },
	// Suburban
	{ model: mp.joaat("v_ilev_clothmiddoor"), position: new mp.Vector3(617.2458, 2751.022, 42.7578), locked: false },
	// Suburban
	{ model: mp.joaat("v_ilev_clothmiddoor"), position: new mp.Vector3(127.8201, -211.8274, 55.2275), locked: false },
	// Suburban
	{ model: mp.joaat("v_ilev_clothmiddoor"), position: new mp.Vector3(-3167.75, 1055.536, 21.5329), locked: false },
	// Tattoo
	{ model: mp.joaat("v_ilev_ta_door"), position: new mp.Vector3(321.81, 178.36, 103.68), locked: false },
	// Tattoo
	{ model: mp.joaat("v_ilev_ml_door1"), position: new mp.Vector3(1859.89, 3749.79, 33.18), locked: false },
	// Tattoo
	{ model: mp.joaat("v_ilev_ml_door1"), position: new mp.Vector3(-289.1752, 6199.112, 31.637), locked: false },
	// Tattoo
	{ model: mp.joaat("v_ilev_ta_door"), position: new mp.Vector3(-1155.454, -1424.008, 5.0461), locked: false },
	// Tattoo
	{ model: mp.joaat("v_ilev_ta_door"), position: new mp.Vector3(1321.286, -1650.597, 52.3663), locked: false },
	// Tattoo
	{ model: mp.joaat("v_ilev_ta_door"), position: new mp.Vector3(-3167.789, 1074.767, 20.9209), locked: false },
	// Pacific standard
	{ model: mp.joaat("hei_prop_hei_bankdoor_new"), position: new mp.Vector3(232.20, 214.59, 106.28), locked: false },
	{ model: mp.joaat("hei_prop_hei_bankdoor_new"), position: new mp.Vector3(231.5123, 216.5177, 106.4049), locked: false },
	// Pacific standard (gate)
	{ model: mp.joaat("hei_v_ilev_bk_gate_pris"), position: new mp.Vector3(256.31, 220.66, 106.43), locked: true },
	// Pacific standard (door)
	{ model: 1956494919, position: new mp.Vector3(237.7703, 227.87, 106.426), locked: false },
	{ model: 1956494919, position: new mp.Vector3(236.5488, 228.3147, 110.4328), locked: true	 },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(16.1279, -1114.605, 29.9469), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(18.572, -1115.495, 29.9469), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(1698.176, 3751.506, 34.8553), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(1699.937, 3753.42, 34.8553), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(244.7274, -44.0791, 70.91), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(243.8379, -46.5232, 70.91), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(845.3624, -1024.539, 28.3448), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(842.7684, -1024.539, 23.3448), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(-326.1122, 6075.27, 31.6047), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(-324.273, 6077.109, 31.6047), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(-665.2424, -944.3256, 21.9792), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(-662.6414, -944.3256, 21.9792), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(-1313.826, -389.1259, 36.8457), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(-1314.465, -391.6472, 36.8457), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(-1114.009, 2689.77, 18.7041), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(-1112.071, 2691.505, 18.7041), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(-3164.845, 1081.392, 20.9887), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(-3163.812, 1083.778, 20.9887), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(2570.905, 303.3556, 108.8848), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(2568.304, 303.3556, 108.8848), locked: false },
	// Ammu-nation
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(813.1779, -2148.27, 29.7689), locked: false },
	{ model: mp.joaat("v_ilev_gc_door03"), position: new mp.Vector3(810.5769, -2148.27, 29.7689), locked: false },
	// Discount (Binco)
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(82.3186, -1392.752, 29.5261), locked: false },
	{ model: mp.joaat("v_ilev_cs_door01_r"), position: new mp.Vector3(82.3186, -1390.476, 29.5261), locked: false },
	// Discount (Binco)
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(1686.983, 4821.741, 42.2131), locked: false },
	{ model: mp.joaat("v_ilev_cs_door01_r"), position: new mp.Vector3(1687.282, 4819.484, 42.2131), locked: false },
	// Discount (Binco)
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(418.637, -806.457, 29.6396), locked: false },
	{ model: mp.joaat("v_ilev_cs_door01_r"), position: new mp.Vector3(418.637, -808.733, 29.6396), locked: false },
	// Discount (Binco)
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(-1096.661, 2705.446, 19.2578), locked: false },
	{ model: mp.joaat("v_ilev_cs_door01_r"), position: new mp.Vector3(-1094.965, 2706.964, 19.2578), locked: false },
	// Discount (Binco)
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(1196.825, 2703.221, 38.3726), locked: false },
	{ model: mp.joaat("v_ilev_cs_door01_r"), position: new mp.Vector3(1199.101, 2703.221, 38.3726), locked: false },
	// Discount (Binco)
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(-818.7642, -1079.544, 11.4781), locked: false },
	{ model: mp.joaat("v_ilev_cs_door01_r"), position: new mp.Vector3(-816.7932, -1078.406, 11.4781), locked: false },
	// Discount (Binco)
	{ model: mp.joaat("v_ilev_gc_door04"), position: new mp.Vector3(-0.0564, 6517.461, 32.0278), locked: false },
	{ model: mp.joaat("v_ilev_cs_door01_r"), position: new mp.Vector3(-1.7253, 6515.914, 32.0278), locked: false },
	// Bennys
	{ model: mp.joaat("lr_prop_supermod_door_01"), position: new mp.Vector3(-205.6828, -1310.683, 30.29572), locked: true },
	// Michael's house
	{ model: mp.joaat("prop_bh1_48_backdoor_r"), position: new mp.Vector3(-794.90, 177.8214, 73.04045), locked: true },
	{ model: mp.joaat("prop_bh1_48_backdoor_l"), position: new mp.Vector3(-796.5657, 177.2214, 73.04045), locked: true },
	// Michael's house
	{ model: mp.joaat("prop_bh1_48_backdoor_r"), position: new mp.Vector3(-794.1853, 182.568, 73.04045), locked: true },
	{ model: mp.joaat("prop_bh1_48_backdoor_l"), position: new mp.Vector3(-793.3943, 180.5075, 73.04045), locked: true },
	// Michael's house
	{ model: mp.joaat("v_ilev_mm_doorm_r"), position: new mp.Vector3(-816.1068, 177.5109, 72.82738), locked: true },
	{ model: mp.joaat("v_ilev_mm_doorm_l"), position: new mp.Vector3(-816.716, 179.098, 72.82738), locked: true },
	// Michael's house
	{ model: mp.joaat("v_ilev_mm_door"), position: new mp.Vector3(-806.2817, 186.0246, 72.62405), locked: true },
	{ model: mp.joaat("v_ilev_mm_doorson"), position: new mp.Vector3(-806.7717, 174.0236, 76.89033), locked: true },
];

const jsonDoorsInfo = JSON.stringify(doorsInfo);

mp.events.add("playerBrowserReady", (player) => {
	player.call("doorControl::setDefaultState", [ jsonDoorsInfo ]);
});
