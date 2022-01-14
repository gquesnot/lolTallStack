<?php

namespace App\Http\Livewire;

use Livewire\Component;

class EnemyFrame extends Component
{
    public ?array $enemyFrames;
    public ?array $participantFrame;

    public function mount($enemyFrames, $participantFrame)
    {
        $this->enemyFrames = $enemyFrames;
        $this->participantFrame = $participantFrame;
    }

    public function render()
    {
        return view('livewire.enemy-frame');
    }
}
