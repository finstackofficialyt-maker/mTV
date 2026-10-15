/*
# Create private booking enquiries

1. New Tables
- `booking_enquiries`
- `id` (uuid, primary key): unique enquiry identifier.
- `reference` (text, unique): human-readable enquiry reference.
- `service_type` (text): requested service category.
- `pickup_address` (text): customer-provided pickup location.
- `destination_address` (text): customer-provided destination or delivery destination.
- `journey_date` (date): requested date where applicable.
- `pickup_time` (time): requested pickup time where applicable.
- `return_journey` (boolean): whether a return journey is requested.
- `return_date` (date): requested return date where applicable.
- `return_time` (time): requested return time where applicable.
- `passengers` (integer): requested passenger count where applicable.
- `luggage_requirements` (text): optional luggage or special requirements.
- `journey_notes` (text): optional journey notes.
- `parcel_details` (text): courier-specific details where applicable.
- `full_name` (text): customer's name.
- `email` (text): customer's email address.
- `phone` (text): customer's phone number.
- `preferred_contact` (text): preferred contact method.
- `created_at` (timestamptz): submission timestamp.

2. Security
- Row level security is enabled.
- Anonymous visitors may create an enquiry but cannot read, update, or delete booking data from the browser.
- The insert policy is intentionally limited to the booking form use case; private booking data is never exposed through a public read policy.

3. Important Notes
- This table stores only information necessary to respond to a booking enquiry.
- Email delivery is handled separately by a server-side function once an email provider secret is configured.
*/

CREATE TABLE IF NOT EXISTS public.booking_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  service_type text NOT NULL CHECK (service_type IN ('airport_transfer', 'private_hire', 'tour_excursion', 'corporate_contract', 'courier_work')),
  pickup_address text,
  destination_address text,
  journey_date date,
  pickup_time time,
  return_journey boolean NOT NULL DEFAULT false,
  return_date date,
  return_time time,
  passengers integer CHECK (passengers IS NULL OR passengers BETWEEN 1 AND 16),
  luggage_requirements text,
  journey_notes text,
  parcel_details text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  preferred_contact text NOT NULL CHECK (preferred_contact IN ('whatsapp', 'phone', 'email')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_can_submit_booking_enquiries" ON public.booking_enquiries;
CREATE POLICY "public_can_submit_booking_enquiries"
ON public.booking_enquiries FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(full_name)) BETWEEN 2 AND 120
  AND length(trim(email)) BETWEEN 5 AND 254
  AND length(trim(phone)) BETWEEN 7 AND 40
);

DROP POLICY IF EXISTS "booking_enquiries_are_not_publicly_readable" ON public.booking_enquiries;
CREATE POLICY "booking_enquiries_are_not_publicly_readable"
ON public.booking_enquiries FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "booking_enquiries_cannot_be_updated_publicly" ON public.booking_enquiries;
CREATE POLICY "booking_enquiries_cannot_be_updated_publicly"
ON public.booking_enquiries FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "booking_enquiries_cannot_be_deleted_publicly" ON public.booking_enquiries;
CREATE POLICY "booking_enquiries_cannot_be_deleted_publicly"
ON public.booking_enquiries FOR DELETE
TO anon, authenticated
USING (false);
