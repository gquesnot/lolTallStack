<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Traits\LolInit;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, LolInit;



    public function loadItems(){
        $this->initLol();
        $items = $this->api->getStaticItems()->getData()['data'];

        foreach($items as $itemId=> $item){
            $dbItem = Item::find($itemId);
            if (!$dbItem){

                $dbItem = new Item;
                $dbItem->id = $itemId;
                $dbItem->name = $item['name'];
                $dbItem->description = $item['description'];
                $dbItem->colloq = $item['colloq'];
                $dbItem->tags = implode(";",$item['tags']);
                $dbItem->gold =$item['gold']['total'];
                $dbItem->stats =json_encode($item['stats']);
                $dbItem->img =$item['image']['full'];//http://ddragon.leagueoflegends.com/cdn/12.1.1/img/item/${image}
                $dbItem->save();
            }

        }
    }

}
