module App.Main
open App.Html
open Browser.Dom

let socks = 
  [ (4,1); (3,2); (2,3); (4,3); (3,4); (4,4); (4,5); (2,5); (2,6); (3,6) ]

type Event =
  | Reset 
  | Play
  | Step 
  | Code of string
  | Home 

type State = 
  { Program : string list 
    Playing : string list option
    Robot : int * int 
    Objective : int
    Animation : string }

let rnd = System.Random() 
let pickSock () = rnd.Next(socks.Length)

let diff = dict [ "down", (1, 0); "up", (-1, 0); "left", (0,-1); "right", (0,1) ]

let step = function 
  | { Playing = Some [] } as state ->
      printfn "%A" (state.Robot, socks.[state.Objective])
      let anim = if state.Robot = socks.[state.Objective] then "win" else "shake"
      { state with Playing = None; Animation = anim }
  | { Playing = Some (step::prog); Robot = r,c } as state ->
      let dr, dc = diff.[step]
      let nr, nc = r + dr, c + dc
      if nr < 1 || nr > 4 || nc < 1 || nc > 6 || (nr = 1 && nc <> 1) then 
        { state with Playing = None; Animation = "shake" }
      else { state with Robot = nr, nc; Playing = Some prog }
  | state -> state

let update state = function
  | Reset -> { state with Program = []; Robot = 1,1 }
  | Home when state.Animation = "win" -> 
    { Program = []; Animation = ""; Playing = None; Robot = 1,1; Objective = pickSock() }
  | Home -> { state with Animation = ""; Playing = None; Robot = 1,1; Program = [] }
  | Code f -> { state with Program = state.Program @ [f] }
  | Play when state.Playing = None -> { state with Playing = Some state.Program } |> step
  | Play -> state
  | Step -> state |> step

let render trigger state =
  if state.Playing.IsSome then window.setTimeout((fun _ -> trigger Step), 1000) |> ignore
  if state.Animation <> "" then window.setTimeout((fun _ -> trigger Home), 3000) |> ignore
  h?div [] [ 
    yield h?div ["class" => "r1"] [ 
      h?div ["class" => "box b1"] [ 
        let r, c = state.Robot
        let style = sprintf "top:%dvw; left:%dvw;" (10*r-10) (10*c-10)
        let cls = "robot " + state.Animation
        h?img [ "class" => cls; "src" => "robot.gif"; "style" => style ] [] 
      ]
      h?div ["class" => "prog"] [ 
        for p in state.Program ->
          h?img [ "src" => p + ".gif" ] [] 
        yield h?img [ "src" => sprintf "s%d.gif" (state.Objective+1); "class" => "objective" ] [] 
      ]
    ]
    for r in 2 .. 4 -> h?div ["class" => "r" + string r] [ 
      for b in 1 .. 6 -> h?div ["class" => "box b" + string b] [
        match socks |> List.tryFindIndex ((=) (r, b)) with
        | Some i -> yield h?img ["src" => "s" + string (i+1) + ".gif"] []
        | _ -> ()
      ]
    ]
    let handlers e = [ 
      "id" => match e with Code c -> c | _ -> "go"
      "touchstart" =!> fun _ je -> je.preventDefault(); trigger e
      "click" =!>  fun _ _ -> trigger e 
    ]
    yield h?div ["class" => "controls"] [
      //h?button [ "click" =!> triggerf Reset; "class" => "mr2" ] [ h?img ["src" => "reset.gif"] [] ]
      h?button (handlers (Code "up")) [ h?img ["src" => "up.gif"] [] ]
      h?button (handlers (Code "right")) [ h?img ["src" => "right.gif"] [] ]
      h?button (handlers (Code "down")) [ h?img ["src" => "down.gif"] [] ]
      h?button (("class" => "mr2")::(handlers (Code "left"))) [ h?img ["src" => "left.gif"] [] ]
      h?button (handlers Play) [ h?img ["src" => "go.gif"] [] ]

    ]
  ]

let init = { Program = []; Playing = None; Robot = 1,1; Animation = ""; Objective = pickSock() }
createVirtualDomApp "game" init render update
