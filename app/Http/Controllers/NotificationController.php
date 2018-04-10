<?php

namespace skyimport\Http\Controllers;

use Illuminate\Http\Request;
use skyimport\Models\Consolidated;
use skyimport\Models\Tracking;
use skyimport\Models\EventsUsers;

class NotificationController extends Controller
{
	public function notifications(Request $request)
	{
		if (\Auth::user()->role_id == 1) {
			$hoy = \Carbon::now()->format('Y-m-d');
			$notifications = Consolidated::where('closed_at', 'LIKE', '%'.$hoy.'%')
							->where('shippingstate_id', '=', 3)->get();
			$notifications_total = $notifications->count();

			$html = "<li class='header'>$notifications_total  Consolidados formalizados hoy.</li>";
			foreach ($notifications as $notification) {
				$consolidated = $notification->number;
				$hace = $notification->created_at->diffForHumans();
				$event = $notification->Shippingstate->state;
				$html .= "<li>
	              <ul class='menu'>
	                <li id='notification' consolidated='$notification->id'>
	                  <a href='#'>
	                    <h4>
	                      <i class='fa fa-cube text-primary'></i>
	                      $consolidated
	                      <small><i class='fa fa-clock-o'></i> $hace</small>
	                    </h4>
	                    <p>$event</p>
	                  </a>
	                </li>
	              </ul>
	            </li>";
			}
			$html .= "<li class='footer'><a href='/consolidados'>Ver todos</a></li>
						</ul>";
		} else {
			$user = \Auth::user()->id;
			$consolidados = Consolidated::where('user_id', '=', $user)->get();
			$notifications_total = 0;

			$html = "<li class='header'> Eventos en Trackings.</li>";
			foreach ($consolidados as $c) {
				foreach ($c->trackings as $t) {
					foreach ($t->eventsUsers as $e) {
						if ($e->consolidated_id == null) {
							if ($e->viewed == 0) {
								$notifications_total++;
							}
							$fecha = $e->created_at->diffForHumans();
							$evento = $e->events;
							$html .= "<li>
				              <ul class='menu'>
				                <li id='notification' consolidated='$c->id'>
				                  <a href='#'>
				                    <h4>
				                      <i class='fa fa-cube text-primary'></i>
				                      $t->tracking
				                      <small><i class='fa fa-clock-o'></i> $fecha</small>
				                    </h4>
				                    <p>$evento->event</p>
				                  </a>
				                </li>
				              </ul>
				            </li>";
						}
					}
				}
			}
			$html .= "<li class='footer'><a href='/consolidados'>Ver todos los consolidados</a></li>";
		}
		return response()->json(compact('html', 'notifications_total'));
	}

	public function viewer()
	{
		if (\Auth::user()->role_id == 1) {
			// $events = EventsUsers::limit(15)->where('tracking_id', '=', null)->get();
			// $events->each(function ($event) {
			// 	return $event->update(['viewed' => '1']);
			// });
		} else {
			$user = \Auth::user()->id;
			$consolidados = Consolidated::where('user_id', '=', $user)->get();

			foreach ($consolidados as $c) {
				foreach ($c->trackings as $t) {
					foreach ($t->eventsUsers as $e) {
						if ($e->consolidated_id == null) {
							$e->update(['viewed' => '1']);
						}
					}
				}
			}
		}
	}

	public function destroy($id)
	{
        $event = EventsUsers::findOrFail($id)->delete();
        return response()->json($event);
	}
}
