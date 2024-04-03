import clsx from 'clsx'
import React from 'react'

export default function ContactActivityPanel({editing, timeline}) {
  return (
    <div className="px-4 py-6 sm:w-1/2 relative">
      {editing && (
        <div className="inset-0 bg-white/75 w-full h-full z-50 absolute rounded-tr-lg" />
      )}
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {timeline.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== timeline.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-zinc-400"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={clsx(
                        event.iconBackground,
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-zinc-100"
                      )}
                    >
                      <event.icon
                        className="h-5 w-5 text-white "
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  {<event.child />}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
