#define CONSTANTS_ONE_G					9.80665f		/* m/s^2		*/
#define CONSTANTS_AIR_DENSITY_SEA_LEVEL_15C		1.225f			/* kg/m^3		*/
#define CONSTANTS_AIR_GAS_CONST				287.1f 			/* J/(kg * K)		*/
#define CONSTANTS_ABSOLUTE_NULL_CELSIUS			-273.15f		/* °C			*/
#define CONSTANTS_RADIUS_OF_EARTH			6371000			/* meters (m)		*/
#define M_DEG_TO_RAD 					0.01745329251994

/* lat/lon are in radians */
struct gpos_reference_s {
    double lat_rad;
    double lon_rad;
    double sin_lat;
    double cos_lat;
    bool init_done;
}_ref_pos;
double _lat_pos, _lon_pos;

int lposgpos_convertor_init(struct gpos_reference_s *ref, double lat_0, double lon_0)
{
    ref->lat_rad = lat_0 * M_DEG_TO_RAD;
    ref->lon_rad = lon_0 * M_DEG_TO_RAD;
    ref->sin_lat = sin(ref->lat_rad);
    ref->cos_lat = cos(ref->lat_rad);
    ref->init_done = true;
    return 0;
}

int lpos_to_gpos(const struct gpos_reference_s *ref, float x, float y, double *lat, double *lon)
{
    if (!ref->init_done) {
        return -1;
    }

    double x_rad = x / CONSTANTS_RADIUS_OF_EARTH;
    double y_rad = y / CONSTANTS_RADIUS_OF_EARTH;
    double c = sqrtf(x_rad * x_rad + y_rad * y_rad);
    double sin_c = sin(c);
    double cos_c = cos(c);

    double lat_rad;
    double lon_rad;

    if (fabs(c) > DBL_EPSILON) {
        lat_rad = asin(cos_c * ref->sin_lat + (x_rad * sin_c * ref->cos_lat) / c);
        lon_rad = (ref->lon_rad + atan2(y_rad * sin_c, c * ref->cos_lat * cos_c - x_rad * ref->sin_lat * sin_c));

    } else {
        lat_rad = ref->lat_rad;
        lon_rad = ref->lon_rad;
    }
    *lat = lat_rad * 180.0 / M_PI;
    *lon = lon_rad * 180.0 / M_PI;
    return 0;
}

int gpos_to_lpos(const struct gpos_reference_s *ref, double lat, double lon, float *x, float *y)
{
	if (!ref->init_done) {
	    return -1;
	}

	double lat_rad = lat * M_DEG_TO_RAD;
	double lon_rad = lon * M_DEG_TO_RAD;

	double sin_lat = sin(lat_rad);
	double cos_lat = cos(lat_rad);
	double cos_d_lon = cos(lon_rad - ref->lon_rad);

	double arg = ref->sin_lat * sin_lat + ref->cos_lat * cos_lat * cos_d_lon;

	if (arg > 1.0) {
		arg = 1.0;

	} else if (arg < -1.0) {
		arg = -1.0;
	}

	double c = acos(arg);
	double k = (fabs(c) < DBL_EPSILON) ? 1.0 : (c / sin(c));

	*x = k * (ref->cos_lat * sin_lat - ref->sin_lat * cos_lat * cos_d_lon) * CONSTANTS_RADIUS_OF_EARTH;
	*y = k * cos_lat * sin(lon_rad - ref->lon_rad) * CONSTANTS_RADIUS_OF_EARTH;

	return 0;
}